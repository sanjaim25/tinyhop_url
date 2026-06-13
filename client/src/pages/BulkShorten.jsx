import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const V = '#7c3aed'
const VD = '#6d28d9'
const INK = '#15141c'
const LINE = 'rgba(20,20,28,0.1)'
const P2 = '#f5f3ef'
const GRN = '#16a34a'
const RED = '#ef4444'

const shortBase = () => import.meta.env.VITE_API_URL || 'http://localhost:5000'



export default function BulkShorten() {
  const { user } = useAuth()
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState(() => {
    // Load results from localStorage on mount
    const saved = localStorage.getItem('bulkShortenResults')
    return saved ? JSON.parse(saved) : null
  })
  const [dragActive, setDragActive] = useState(false)
  const hasShownToast = useRef(false)
  const fileInputRef = useRef(null)

  // Save results to localStorage whenever they change
  useEffect(() => {
    if (results) {
      localStorage.setItem('bulkShortenResults', JSON.stringify(results))
    } else {
      localStorage.removeItem('bulkShortenResults')
    }
  }, [results])

  // Show notification if results were loaded from storage
  useEffect(() => {
    // Only show toast once per page load
    if (hasShownToast.current) return
    
    const saved = localStorage.getItem('bulkShortenResults')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.processedAt) {
        hasShownToast.current = true
        const timeDiff = Date.now() - new Date(parsed.processedAt).getTime()
        const minutesAgo = Math.floor(timeDiff / 60000)
        if (minutesAgo < 60) {
          toast.success(`Previous results restored (${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago)`, { duration: 4000 })
        } else {
          toast.success('Previous results restored', { duration: 4000 })
        }
      }
    }
  }, [])

  const clearResults = () => {
    setResults(null)
    setFile(null)
    localStorage.removeItem('bulkShortenResults')
    toast.success('Results cleared')
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return
    
    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file')
      return
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }
    
    setFile(selectedFile)
    setResults(null)
  }

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim())
    const urls = []
    
    // Check if first line is header
    const hasHeader = lines[0].toLowerCase().includes('url') || lines[0].toLowerCase().includes('link')
    const startIndex = hasHeader ? 1 : 0
    
    for (let i = startIndex; i < lines.length; i++) {
      const columns = lines[i].split(',').map(col => col.trim().replace(/^"|"$/g, ''))
      
      if (columns[0]) {
        urls.push({
          originalUrl: columns[0],
          customAlias: columns[1] || undefined
        })
      }
    }
    
    return urls
  }

  const processFile = async () => {
    if (!file) {
      toast.error('Please select a file first')
      return
    }

    setProcessing(true)
    
    try {
      const text = await file.text()
      const urls = parseCSV(text)
      
      if (urls.length === 0) {
        toast.error('No valid URLs found in CSV')
        setProcessing(false)
        return
      }
      
      if (urls.length > 1000) {
        toast.error('Maximum 1000 URLs per batch')
        setProcessing(false)
        return
      }

      toast.loading(`Processing ${urls.length} URLs...`, { id: 'bulk-process' })
      
      const batchName = `Bulk Upload - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
      const response = await api.post('/api/urls/bulk', { urls, batchName })
      
      const resultsWithTimestamp = {
        ...response.data,
        processedAt: new Date().toISOString()
      }
      
      setResults(resultsWithTimestamp)
      toast.success(`Batch created! ${response.data.successful} successful, ${response.data.failed} failed`, { id: 'bulk-process' })
    } catch (err) {
      console.error('Bulk processing error:', err)
      toast.error(err.response?.data?.error || 'Failed to process URLs', { id: 'bulk-process' })
    } finally {
      setProcessing(false)
    }
  }

  const downloadCSV = () => {
    if (!results) return
    
    const base = shortBase()
    let csvContent = 'Original URL,Short Code,Short URL,Status,Error\n'
    
    results.results.forEach(result => {
      const row = [
        `"${result.originalUrl}"`,
        result.shortCode || '',
        result.shortCode ? `"${base}/${result.shortCode}"` : '',
        result.status,
        result.error || ''
      ]
      csvContent += row.join(',') + '\n'
    })
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `shortened-links-${Date.now()}.csv`
    link.click()
    
    toast.success('CSV downloaded!')
  }

  const downloadPDF = () => {
    if (!results) return
    
    try {
      const base = shortBase()
      const doc = new jsPDF()
      
      // Header
      doc.setFontSize(20)
      doc.setTextColor(124, 58, 237)
      doc.text('Bulk URL Shortening Results', 14, 20)
      
      // Summary
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      doc.text(`Total URLs: ${results.total}`, 14, 30)
      doc.text(`Successful: ${results.successful}`, 14, 36)
      doc.text(`Failed: ${results.failed}`, 14, 42)
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 48)
      
      // Table data
      const tableData = results.results.map(result => [
        result.originalUrl.length > 40 ? result.originalUrl.substring(0, 37) + '...' : result.originalUrl,
        result.shortCode || '-',
        result.shortCode ? `${base}/${result.shortCode}` : '-',
        result.status === 'success' ? 'Success' : 'Failed',
        result.error || ''
      ])
      
      // Generate table
      autoTable(doc, {
        head: [['Original URL', 'Short Code', 'Short URL', 'Status', 'Error']],
        body: tableData,
        startY: 55,
        styles: { 
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [124, 58, 237],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 243, 239],
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 30 },
          2: { cellWidth: 45 },
          3: { cellWidth: 25 },
          4: { cellWidth: 35 },
        },
        didParseCell: function(data) {
          // Color status column
          if (data.column.index === 3 && data.section === 'body') {
            if (data.cell.text[0] === 'Success') {
              data.cell.styles.textColor = [22, 163, 74]
              data.cell.styles.fontStyle = 'bold'
            } else if (data.cell.text[0] === 'Failed') {
              data.cell.styles.textColor = [239, 68, 68]
              data.cell.styles.fontStyle = 'bold'
            }
          }
        },
        margin: { top: 55, left: 14, right: 14 },
      })
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150)
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        )
        doc.text(
          'Generated by TinyHop URL Shortener',
          14,
          doc.internal.pageSize.height - 10
        )
      }
      
      // Download as normal PDF
      doc.save(`shortened-links-${Date.now()}.pdf`)
      toast.success('PDF downloaded!')
    } catch (error) {
      console.error('PDF generation error:', error)
      toast.error('Failed to generate PDF. Please try CSV export instead.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#eceae4', paddingTop: 64, fontFamily: "'Space Grotesk',sans-serif" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
      `}</style>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.04, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")" }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeUp .6s ease both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 14px', background: `${V}12`, border: `1px solid ${V}28`, borderRadius: 99, marginBottom: 16 }}>
            <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: V }}>Bulk Shortening</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.93, color: INK, marginBottom: 14 }}>
            Shorten <em style={{ fontStyle: 'italic', color: V }}>Multiple</em> Links
          </h1>
          <p style={{ fontSize: '1rem', color: '#8d8b94', maxWidth: 600, margin: '0 auto', lineHeight: 1.65 }}>
            Upload a CSV file with URLs and get shortened links for all of them at once. Download results as CSV or PDF.
          </p>
        </div>

        {/* CSV Format Info */}
        <div style={{ maxWidth: 800, margin: '0 auto 32px', background: '#fff', border: `1px solid ${LINE}`, borderRadius: 16, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: INK, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={V} strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              CSV Format Instructions
            </h3>
            <button
              onClick={() => {
                const csvContent = 'URL,Custom Alias (optional)\nhttps://example.com/page1,my-link\nhttps://example.com/page2\nhttps://example.com/page3,another-alias\n'
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = 'bulk-urls-template.csv'
                link.click()
                toast.success('Template downloaded!')
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                background: V,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: "'Space Grotesk',sans-serif",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = VD}
              onMouseLeave={(e) => e.currentTarget.style.background = V}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Template
            </button>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#8d8b94', marginBottom: 12, lineHeight: 1.6 }}>
            Your CSV file should have 2 columns (second column is optional):
          </p>
          <div style={{ background: P2, borderRadius: 8, padding: '12px 16px', fontFamily: "'Fragment Mono',monospace", fontSize: '0.75rem', color: INK }}>
            <div><strong>URL, Custom Alias (optional)</strong></div>
            <div>https://example.com/page1, my-link</div>
            <div>https://example.com/page2</div>
            <div>https://example.com/page3, another-alias</div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#8d8b94', marginTop: 10 }}>
            • Maximum 1000 URLs per file • Custom aliases must be at least 3 characters • File size limit: 5MB
          </p>
        </div>

        {/* Upload Section */}
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 22, overflow: 'hidden', boxShadow: '0 6px 32px rgba(20,20,28,0.09)', marginBottom: 24 }}>
            <div style={{ height: 3, background: `linear-gradient(90deg,${V},${VD})` }} />
            
            <div style={{ padding: '32px 40px' }}>
              {/* Drop zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragActive ? V : LINE}`,
                  borderRadius: 16,
                  padding: '48px 24px',
                  textAlign: 'center',
                  background: dragActive ? `${V}05` : P2,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  marginBottom: 20,
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  style={{ display: 'none' }}
                />
                
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>📄</div>
                
                {file ? (
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', fontWeight: 600, color: GRN, marginBottom: 8 }}>
                      ✓ {file.name}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', color: '#8d8b94' }}>
                      {(file.size / 1024).toFixed(2)} KB
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setFile(null)
                        setResults(null)
                      }}
                      style={{
                        marginTop: 12,
                        padding: '6px 16px',
                        background: RED,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: "'Space Grotesk',sans-serif",
                      }}
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', fontWeight: 600, color: INK, marginBottom: 8 }}>
                      Drop your CSV file here
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', color: '#8d8b94', marginBottom: 16 }}>
                      or click to browse
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: V, color: '#fff', borderRadius: 99, fontSize: '0.875rem', fontWeight: 600 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Choose File
                    </div>
                  </div>
                )}
              </div>

              {/* Process Button */}
              <button
                onClick={processFile}
                disabled={!file || processing}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: !file || processing ? '#9f67f5' : INK,
                  color: '#eceae4',
                  border: 'none',
                  borderRadius: 14,
                  fontFamily: "'Playfair Display',serif",
                  fontStyle: 'italic',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  cursor: !file || processing ? 'not-allowed' : 'pointer',
                  transition: 'all .2s',
                  boxShadow: '0 4px 16px rgba(20,20,28,0.16)',
                }}
                onMouseEnter={(e) => {
                  if (file && !processing) {
                    e.target.style.background = V
                    e.target.style.boxShadow = `0 8px 28px ${V}50`
                  }
                }}
                onMouseLeave={(e) => {
                  if (file && !processing) {
                    e.target.style.background = INK
                    e.target.style.boxShadow = '0 4px 16px rgba(20,20,28,0.16)'
                  }
                }}
              >
                {processing ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>⚙️</span>
                    Processing URLs...
                  </span>
                ) : (
                  'Process URLs'
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          {results && (
            <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 22, overflow: 'hidden', boxShadow: '0 6px 32px rgba(20,20,28,0.09)', animation: 'fadeUp .4s ease both' }}>
              <div style={{ height: 3, background: `linear-gradient(90deg,${GRN},${V})` }} />
              
              {/* Summary */}
              <div style={{ padding: '24px 32px', borderBottom: `1px solid ${LINE}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: INK, margin: 0 }}>
                    Processing Complete
                  </h2>
                  {results.processedAt && (
                    <div style={{ fontSize: '0.75rem', color: '#8d8b94', textAlign: 'right' }}>
                      <div style={{ fontWeight: 600 }}>Processed:</div>
                      <div>{new Date(results.processedAt).toLocaleString()}</div>
                    </div>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
                  <div style={{ textAlign: 'center', padding: '12px', background: P2, borderRadius: 10 }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: V, fontFamily: "'Playfair Display',serif" }}>{results.total}</div>
                    <div style={{ fontSize: '0.75rem', color: '#8d8b94', fontWeight: 600 }}>Total</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', background: `${GRN}10`, borderRadius: 10 }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: GRN, fontFamily: "'Playfair Display',serif" }}>{results.successful}</div>
                    <div style={{ fontSize: '0.75rem', color: '#8d8b94', fontWeight: 600 }}>Successful</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', background: `${RED}10`, borderRadius: 10 }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: RED, fontFamily: "'Playfair Display',serif" }}>{results.failed}</div>
                    <div style={{ fontSize: '0.75rem', color: '#8d8b94', fontWeight: 600 }}>Failed</div>
                  </div>
                </div>
              </div>

              {/* Download Buttons */}
              <div style={{ padding: '24px 32px', borderBottom: `1px solid ${LINE}`, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={downloadCSV}
                  style={{
                    flex: 1,
                    minWidth: 200,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 24px',
                    background: V,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: "'Space Grotesk',sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = VD
                    e.target.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = V
                    e.target.style.transform = ''
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download CSV
                </button>
                <button
                  onClick={downloadPDF}
                  style={{
                    flex: 1,
                    minWidth: 200,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 24px',
                    background: INK,
                    color: '#eceae4',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: "'Space Grotesk',sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#2a2830'
                    e.target.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = INK
                    e.target.style.transform = ''
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download PDF
                </button>
                <button
                  onClick={clearResults}
                  style={{
                    minWidth: 150,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 24px',
                    background: 'transparent',
                    color: RED,
                    border: `1px solid ${RED}`,
                    borderRadius: 10,
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: "'Space Grotesk',sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = RED
                    e.target.style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent'
                    e.target.style.color = RED
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                  Clear Results
                </button>
              </div>

              {/* Results Table */}
              <div style={{ overflowX: 'auto', maxHeight: 500, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                  <thead style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
                    <tr style={{ background: P2 }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#8d8b94', fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: `1px solid ${LINE}` }}>Original URL</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#8d8b94', fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: `1px solid ${LINE}` }}>Short Code</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#8d8b94', fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: `1px solid ${LINE}` }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#8d8b94', fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: `1px solid ${LINE}` }}>Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.results.map((result, idx) => (
                      <tr key={idx} style={{ borderBottom: `1px solid ${LINE}` }}>
                        <td style={{ padding: '12px 16px', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#8d8b94' }} title={result.originalUrl}>
                          {result.originalUrl}
                        </td>
                        <td style={{ padding: '12px 16px', fontFamily: "'Fragment Mono',monospace", fontWeight: 600, color: result.status === 'success' ? V : '#b0adb8' }}>
                          {result.shortCode || '-'}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          {result.status === 'success' ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: `${GRN}15`, color: GRN, borderRadius: 99, fontSize: '0.75rem', fontWeight: 600 }}>
                              ✓ Success
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: `${RED}15`, color: RED, borderRadius: 99, fontSize: '0.75rem', fontWeight: 600 }}>
                              ✗ Failed
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px', color: RED, fontSize: '0.75rem' }}>
                          {result.error || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}




