import { SSMLElement } from '../core/SSMLElement';

/**
 * SSML element for text substitution and pronunciation aliases.
 * 
 * The `<sub>` element allows you to specify an alternative pronunciation for text by providing
 * an alias that should be spoken instead of the written text. This is essential for acronyms,
 * abbreviations, technical terms, or any text where the written form differs from how it should
 * be pronounced. The visual representation remains unchanged while the speech output uses the alias.
 * 
 * The sub element is particularly useful for maintaining readable text while ensuring correct
 * pronunciation, such as expanding abbreviations like "Dr." to "Doctor" or providing phonetic
 * pronunciations for company names or technical terms that might be mispronounced by default.
 * 
 * @example
 * ```typescript
 * // Simple abbreviation
 * const sub = new SubElement('Dr.', 'Doctor');
 * sub.render();
 * // Output: <sub alias="Doctor">Dr.</sub>
 * 
 * // Acronym expansion
 * const acronym = new SubElement('WHO', 'World Health Organization');
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .text('The ')
 *     .sub('CEO', 'Chief Executive Officer')
 *     .text(' will speak at the meeting.')
 *   .build();
 * ```
 * 
 * @remarks
 * - The sub element can only contain text and no other elements [[11]]
 * - The original text is displayed visually while the alias is spoken
 * - Special XML characters in the original text are automatically escaped
 * - The alias attribute is not escaped as it should contain plain text
 * - Useful for maintaining document readability while ensuring correct pronunciation
 * - Can be used within voice, paragraph, sentence, and most other container elements
 * 
 * @see {@link https://www.w3.org/TR/speech-synthesis11/#S3.1.11} W3C SSML Sub Element Specification
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup} Azure SSML Documentation
 */
export class SubElement extends SSMLElement {
  /**
   * The original text as it appears in writing.
   * @private
   */
  private original: string;
  
  /**
   * The pronunciation alias to be spoken instead of the original text.
   * @private
   */
  private alias: string;

  /**
   * Creates a new SubElement instance.
   * 
   * @param original - The original text as it appears in the document.
   *                   This is the written form that will be displayed but not spoken.
   *                   Special XML characters (&, <, >, ", ') are automatically escaped
   *                   to ensure valid XML output and prevent injection attacks.
   *                   Examples:
   *                   - Abbreviations: "Dr.", "Mr.", "Ms.", "Inc.", "Ltd."
   *                   - Acronyms: "NASA", "WHO", "API", "HTML", "SQL"
   *                   - Technical terms: "www", "etc.", "vs."
   *                   - Company names: "AT&T", "P&G"
   * 
   * @param alias - The text that should be spoken instead of the original.
   *                This is the pronunciation or expanded form of the original text.
   *                Should be written exactly as it should be pronounced.
   *                Examples:
   *                - For "Dr.": "Doctor"
   *                - For "NASA": "National Aeronautics and Space Administration"
   *                - For "www": "world wide web"
   *                - For "etc.": "et cetera"
   *                - For "&": "and"
   * 
   * @example
   * ```typescript
   * // Common abbreviations
   * const doctor = new SubElement('Dr.', 'Doctor');
   * const mister = new SubElement('Mr.', 'Mister');
   * const incorporated = new SubElement('Inc.', 'Incorporated');
   * 
   * // Acronyms
   * const api = new SubElement('API', 'Application Programming Interface');
   * const html = new SubElement('HTML', 'HyperText Markup Language');
   * const sql = new SubElement('SQL', 'Structured Query Language');
   * 
   * // Technical terms
   * const website = new SubElement('www.example.com', 'w w w dot example dot com');
   * const versus = new SubElement('vs.', 'versus');
   * const etcetera = new SubElement('etc.', 'et cetera');
   * 
   * // Company names with special characters
   * const att = new SubElement('AT&T', 'A T and T');
   * const pandg = new SubElement('P&G', 'P and G');
   * 
   * // Chemical formulas
   * const water = new SubElement('H2O', 'H two O');
   * const co2 = new SubElement('CO2', 'C O two');
   * 
   * // Units and measurements
   * const kilometers = new SubElement('km', 'kilometers');
   * const fahrenheit = new SubElement('°F', 'degrees Fahrenheit');
   * ```
   */
  constructor(original: string, alias: string) {
    super();
    this.original = original;
    this.alias = alias;
  }

  /**
   * Renders the sub element as an SSML XML string.
   * 
   * Generates the `<sub>` element with the alias attribute specifying the text to be spoken
   * and the original text as the element's content. The original text is automatically escaped
   * to prevent XML injection and ensure valid output. The rendered element instructs the speech
   * synthesizer to speak the alias text instead of the original content.
   * 
   * @returns The XML string representation of the sub element in the format:
   *          `<sub alias="pronunciation">original text</sub>`
   * 
   * @example
   * ```typescript
   * // Simple abbreviation
   * const dr = new SubElement('Dr.', 'Doctor');
   * console.log(dr.render());
   * // Output: <sub alias="Doctor">Dr.</sub>
   * 
   * // Acronym
   * const who = new SubElement('WHO', 'World Health Organization');
   * console.log(who.render());
   * // Output: <sub alias="World Health Organization">WHO</sub>
   * 
   * // With special characters (automatically escaped in original)
   * const att = new SubElement('AT&T', 'A T and T');
   * console.log(att.render());
   * // Output: <sub alias="A T and T">AT&amp;T</sub>
   * 
   * // Technical notation
   * const squared = new SubElement('m²', 'meters squared');
   * console.log(squared.render());
   * // Output: <sub alias="meters squared">m²</sub>
   * 
   * // URL
   * const url = new SubElement('example.com', 'example dot com');
   * console.log(url.render());
   * // Output: <sub alias="example dot com">example.com</sub>
   * ```
   * 
   * @override
   */
  render(): string {
    return `<sub alias="${this.alias}">${this.escapeXml(this.original)}</sub>`;
  }
}
