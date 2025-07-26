import type { 
  InfrastructureResponse, 
  ParsedResponseState 
} from '@/types/infrastructure'
import { ResponseSection } from '@/types/infrastructure'


export class InfrastructureResponseParser {
  private static readonly SECTION_PATTERNS = {
    [ResponseSection.INTRO]: {
      start: /```introduction\s*\n?([\s\S]*?)$/,
      end: /```introduction\s*\n?([\s\S]*?)\s*```/
    },
    [ResponseSection.PULUMI_CODE]: {
      start: /```pulumi_code\s*\n?([\s\S]*?)$/,
      end: /```pulumi_code\s*\n?([\s\S]*?)\s*```/
    },
    [ResponseSection.INFRA0_SCHEMA]: {
      start: /```infra0_schema\s*\n?([\s\S]*?)$/,
      end: /```infra0_schema\s*\n?([\s\S]*?)\s*```/
    },
    [ResponseSection.OUTRO]: {
      start: /```outro\s*\n?([\s\S]*?)$/,
      end: /```outro\s*\n?([\s\S]*?)\s*```/
    }
  }

  private static readonly SECTION_ORDER = [
    ResponseSection.INTRO,
    ResponseSection.PULUMI_CODE,
    ResponseSection.INFRA0_SCHEMA,
    ResponseSection.OUTRO
  ]

  static parseStreamingResponse(content: string): ParsedResponseState {
    const sections: InfrastructureResponse = {}
    const foundSections = new Set<ResponseSection>()
    let currentSection: ResponseSection | null = null

    for (const [sectionType, pattern] of Object.entries(this.SECTION_PATTERNS)) {
      const startMatch = content.match(pattern.start)
      const endMatch = content.match(pattern.end)
      const match = endMatch ? endMatch[1] : startMatch ? startMatch[1] : null



      if (match) {
        const section = sectionType as ResponseSection
        foundSections.add(section)
        
        try {
          switch (section) {
            case ResponseSection.INTRO:
              sections.intro = match.trim()
              break
            case ResponseSection.PULUMI_CODE:
              sections.pulumiCode = match.trim()
              break
            case ResponseSection.INFRA0_SCHEMA:
              sections.infra0Schema = match.trim()
              break
            case ResponseSection.OUTRO:
              sections.outro = match.trim()
              break
          }
        } catch (error) {
          console.warn(`Failed to parse section ${section}:`, error)
        }
      }
    }

    // Determine current section being streamed
    for (const section of this.SECTION_ORDER) {
      if (!foundSections.has(section)) {
        // Check if this section is currently being streamed (partial match)
        const sectionStart = this.getSectionStart(content, section)
        if (sectionStart !== -1) {
          currentSection = section
        }
        break
      }
    }

    // If all sections are found, we're complete
    const isComplete = this.SECTION_ORDER.every(section => foundSections.has(section))

    return {
      currentSection,
      sections,
      isComplete
    }
  }

  private static getSectionStart(content: string, section: ResponseSection): number {
    const startPattern = new RegExp(`\`\`\`${section}`)
    const match = content.match(startPattern)
    return match ? match.index! : -1
  }

}

export { ResponseSection } from '@/types/infrastructure' 