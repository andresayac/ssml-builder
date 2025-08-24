import { SSMLElement } from '../core/SSMLElement';

/**
 * SSML element for referencing external pronunciation lexicon files.
 * 
 * The `<lexicon>` element allows you to reference an external Pronunciation Lexicon Specification (PLS)
 * file that contains custom pronunciations for words and phrases. This is useful for defining
 * consistent pronunciations for technical terms, brand names, acronyms, or any words that the
 * text-to-speech engine might pronounce incorrectly by default. The lexicon provides a way to
 * specify phonetic pronunciations without embedding them directly in the SSML document.
 * 
 * The lexicon file must be in the W3C Pronunciation Lexicon Specification (PLS) format and
 * accessible via HTTPS. Multiple lexicon elements can be used to reference different lexicon files,
 * and they are processed in the order they appear in the document.
 * 
 * @example
 * ```typescript
 * // Reference a pronunciation lexicon
 * const lexicon = new LexiconElement('https://example.com/lexicon.xml');
 * lexicon.render();
 * // Output: <lexicon uri="https://example.com/lexicon.xml"/>
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .lexicon('https://example.com/company-terms.xml')
 *     .text('Our product AzureML uses advanced AI.')
 *   .build();
 * 
 * // Multiple lexicons for different domains
 * const ssmlMulti = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .lexicon('https://example.com/technical-terms.xml')
 *     .lexicon('https://example.com/brand-names.xml')
 *     .text('Microsoft Azure provides cloud computing services.')
 *   .build();
 * ```
 * 
 * @remarks
 * - The lexicon file must be accessible via HTTPS (not HTTP) for security reasons
 * - The file must be in valid PLS (Pronunciation Lexicon Specification) XML format
 * - Maximum file size limits may apply depending on the service tier
 * - Lexicon entries override default pronunciations for the duration of the session
 * - Multiple lexicon elements are processed in document order
 * - If a word appears in multiple lexicons, the last definition takes precedence
 * - The lexicon element is self-closing and cannot contain text or other elements
 * - Lexicon files are cached by the service for performance
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#pronunciation-lexicon} Lexicon Element Documentation
 * @see {@link https://www.w3.org/TR/pronunciation-lexicon/} W3C Pronunciation Lexicon Specification
 */
export class LexiconElement extends SSMLElement {
  /**
   * The URI of the pronunciation lexicon file.
   * @private
   */
  private uri: string;

  /**
   * Creates a new LexiconElement instance.
   * 
   * @param uri - The URI of the pronunciation lexicon file.
   *              Must be a publicly accessible HTTPS URL pointing to a valid PLS XML file.
   *              The file should contain pronunciation definitions in the W3C PLS format.
   *              Common use cases include:
   *              - Technical terminology specific to your domain
   *              - Company or product names with non-standard pronunciations
   *              - Acronyms that should be expanded or pronounced differently
   *              - Foreign words that need specific pronunciation rules
   * 
   * @example
   * ```typescript
   * // Reference a general pronunciation lexicon
   * const generalLexicon = new LexiconElement(
   *   'https://cdn.example.com/lexicons/general.xml'
   * );
   * 
   * // Reference domain-specific lexicons
   * const medicalLexicon = new LexiconElement(
   *   'https://example.com/lexicons/medical-terms.xml'
   * );
   * 
   * const techLexicon = new LexiconElement(
   *   'https://example.com/lexicons/tech-acronyms.xml'
   * );
   * 
   * // Reference a company-specific lexicon
   * const companyLexicon = new LexiconElement(
   *   'https://company.com/assets/brand-pronunciations.xml'
   * );
   * ```
   * 
   * Example PLS file structure:
   * ```
   * <?xml version="1.0" encoding="UTF-8"?>
   * <lexicon version="1.0" 
   *          xmlns="http://www.w3.org/2005/01/pronunciation-lexicon"
   *          alphabet="ipa" xml:lang="en-US">
   *   <lexeme>
   *     <grapheme>SQL</grapheme>
   *     <phoneme>ˈɛs kjuː ˈɛl</phoneme>
   *   </lexeme>
   *   <lexeme>
   *     <grapheme>Azure</grapheme>
   *     <phoneme>ˈæʒər</phoneme>
   *   </lexeme>
   * </lexicon>
   * ```
   */
  constructor(uri: string) {
    super();
    this.uri = uri;
  }

  /**
   * Renders the lexicon element as an SSML XML string.
   * 
   * Generates the `<lexicon>` element with the uri attribute pointing to the external
   * pronunciation lexicon file. This is a self-closing element that doesn't contain
   * any content or child elements. The URI value is inserted directly without escaping
   * as it should be a valid URL.
   * 
   * @returns The XML string representation of the lexicon element in the format:
   *          `<lexicon uri="url"/>`
   * 
   * @example
   * ```typescript
   * // Simple lexicon reference
   * const lexicon = new LexiconElement('https://example.com/lexicon.xml');
   * console.log(lexicon.render());
   * // Output: <lexicon uri="https://example.com/lexicon.xml"/>
   * 
   * // With specific path
   * const techLexicon = new LexiconElement(
   *   'https://cdn.example.com/lexicons/v2/technical.xml'
   * );
   * console.log(techLexicon.render());
   * // Output: <lexicon uri="https://cdn.example.com/lexicons/v2/technical.xml"/>
   * 
   * // Company lexicon
   * const brandLexicon = new LexiconElement(
   *   'https://assets.company.com/speech/brand-terms.pls'
   * );
   * console.log(brandLexicon.render());
   * // Output: <lexicon uri="https://assets.company.com/speech/brand-terms.pls"/>
   * ```
   * 
   * @override
   */
  render(): string {
    return `<lexicon uri="${this.uri}"/>`;
  }
}
