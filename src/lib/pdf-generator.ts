import jsPDF from 'jspdf'
import { diagnosisTypes } from '@/data/diagnosis-types'

export interface PDFData {
  userType: string
  timestamp: string
  answers?: Record<string, number>
  scores?: Record<string, number>
}

export function generateDiagnosisPDF(data: PDFData): jsPDF {
  const pdf = new jsPDF()
  const typeData = diagnosisTypes[data.userType]
  
  if (!typeData) {
    throw new Error('Invalid user type')
  }

  // フォント設定（日本語対応）
  pdf.setFont('helvetica')
  
  // ヘッダー
  pdf.setFontSize(20)
  pdf.text('InnerLog AI診断 - 詳細分析レポート', 20, 30)
  
  pdf.setFontSize(16)
  pdf.text(`${typeData.englishName} (${typeData.name})`, 20, 50)
  
  pdf.setFontSize(12)
  pdf.text(`診断日時: ${new Date(data.timestamp).toLocaleString('ja-JP')}`, 20, 65)
  
  // サブタイトル
  pdf.setFontSize(14)
  pdf.text(typeData.subtitle, 20, 85)
  
  let yPosition = 105
  
  // タイプ特性
  pdf.setFontSize(14)
  pdf.text('■ あなたのタイプ特性', 20, yPosition)
  yPosition += 15
  
  pdf.setFontSize(10)
  const characteristics = typeData.free_content.type_characteristics.split('\n')
  characteristics.forEach(line => {
    if (line.trim()) {
      const wrappedLines = pdf.splitTextToSize(line, 170)
      wrappedLines.forEach((wrappedLine: string) => {
        pdf.text(wrappedLine, 20, yPosition)
        yPosition += 5
      })
      yPosition += 2
    }
  })
  
  // 新しいページが必要かチェック
  if (yPosition > 250) {
    pdf.addPage()
    yPosition = 30
  }
  
  // 成長トリガー
  yPosition += 10
  pdf.setFontSize(14)
  pdf.text('■ 成長トリガー', 20, yPosition)
  yPosition += 15
  
  pdf.setFontSize(10)
  const triggers = typeData.free_content.growth_triggers.split('\n')
  triggers.forEach(line => {
    if (line.trim()) {
      const wrappedLines = pdf.splitTextToSize(line, 170)
      wrappedLines.forEach((wrappedLine: string) => {
        pdf.text(wrappedLine, 20, yPosition)
        yPosition += 5
      })
      yPosition += 2
    }
  })
  
  // プレミアムコンテンツ（詳細分析）
  if (yPosition > 200) {
    pdf.addPage()
    yPosition = 30
  }
  
  yPosition += 15
  pdf.setFontSize(16)
  pdf.text('プレミアム詳細分析', 20, yPosition)
  yPosition += 20
  
  // AI時代の強み分析
  pdf.setFontSize(14)
  pdf.text('■ AI時代の詳細な強み分析', 20, yPosition)
  yPosition += 15
  
  pdf.setFontSize(10)
  const strengths = typeData.premium_content.ai_era_strengths.split('\n')
  strengths.forEach(line => {
    if (line.trim()) {
      const wrappedLines = pdf.splitTextToSize(line, 170)
      wrappedLines.forEach((wrappedLine: string) => {
        if (yPosition > 280) {
          pdf.addPage()
          yPosition = 30
        }
        pdf.text(wrappedLine, 20, yPosition)
        yPosition += 5
      })
      yPosition += 2
    }
  })
  
  // 弱み改善ガイド
  if (yPosition > 200) {
    pdf.addPage()
    yPosition = 30
  }
  
  yPosition += 10
  pdf.setFontSize(14)
  pdf.text('■ AI時代の弱み改善ガイド', 20, yPosition)
  yPosition += 15
  
  pdf.setFontSize(10)
  const weaknesses = typeData.premium_content.ai_era_weaknesses.split('\n')
  weaknesses.forEach(line => {
    if (line.trim()) {
      const wrappedLines = pdf.splitTextToSize(line, 170)
      wrappedLines.forEach((wrappedLine: string) => {
        if (yPosition > 280) {
          pdf.addPage()
          yPosition = 30
        }
        pdf.text(wrappedLine, 20, yPosition)
        yPosition += 5
      })
      yPosition += 2
    }
  })
  
  // 活躍できる業界・職種
  if (yPosition > 200) {
    pdf.addPage()
    yPosition = 30
  }
  
  yPosition += 10
  pdf.setFontSize(14)
  pdf.text('■ 活躍できる業界・職種', 20, yPosition)
  yPosition += 15
  
  pdf.setFontSize(10)
  const industries = typeData.premium_content.industries.split('\n')
  industries.forEach(line => {
    if (line.trim()) {
      const wrappedLines = pdf.splitTextToSize(line, 170)
      wrappedLines.forEach((wrappedLine: string) => {
        if (yPosition > 280) {
          pdf.addPage()
          yPosition = 30
        }
        pdf.text(wrappedLine, 20, yPosition)
        yPosition += 5
      })
      yPosition += 2
    }
  })
  
  // キャリアパス
  if (yPosition > 200) {
    pdf.addPage()
    yPosition = 30
  }
  
  yPosition += 10
  pdf.setFontSize(14)
  pdf.text('■ 具体的キャリアパス', 20, yPosition)
  yPosition += 15
  
  pdf.setFontSize(10)
  const careerPaths = typeData.premium_content.career_paths.split('\n')
  careerPaths.forEach(line => {
    if (line.trim()) {
      const wrappedLines = pdf.splitTextToSize(line, 170)
      wrappedLines.forEach((wrappedLine: string) => {
        if (yPosition > 280) {
          pdf.addPage()
          yPosition = 30
        }
        pdf.text(wrappedLine, 20, yPosition)
        yPosition += 5
      })
      yPosition += 2
    }
  })
  
  // フッター
  const pageCount = pdf.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.text(`InnerLog AI診断 - ${i}/${pageCount}`, 20, 290)
    pdf.text('© 2025 InnerLog. All rights reserved.', 150, 290)
  }
  
  return pdf
}

export function downloadPDF(pdf: jsPDF, filename: string = 'innerlog-diagnosis-report.pdf') {
  pdf.save(filename)
}