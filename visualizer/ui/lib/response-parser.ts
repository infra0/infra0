import type { 
  InfrastructureResponse, 
  ParsedResponseState,
  UserPrompt
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

  static readonly SECTION_ORDER = [
    ResponseSection.INTRO,
    ResponseSection.PULUMI_CODE,
    ResponseSection.INFRA0_SCHEMA,
    ResponseSection.OUTRO
  ]

  static parseStreamingResponse(content: string): ParsedResponseState {
    const sections: InfrastructureResponse = {}
    const foundSections = new Set<ResponseSection>()

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

    let activeSection = this.SECTION_ORDER[0]

    for(const section of this.SECTION_ORDER.reverse()) {
      if(foundSections.has(section)) {
        activeSection = section
        break;
      }
    }

    return {
      sections,
      activeSection,
    }
  }

  static getConclusion(content: string) {
    const match = content.match(this.SECTION_PATTERNS[ResponseSection.OUTRO].end)
    return match ? match[1].trim() : null
  }

  static parseUserPrompt(content: string) : UserPrompt | null {
    return null; // TODO: Implement this
  }


}

export { ResponseSection } from '@/types/infrastructure' 