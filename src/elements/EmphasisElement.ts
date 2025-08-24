import { SSMLElement } from '../core/SSMLElement';
import { type EmphasisLevel } from '../types';

/**
 * SSML element for applying emphasis to text in synthesized speech.
 * 
 * The `<emphasis>` element modifies the speaking style to emphasize or de-emphasize
 * words or phrases within the speech output. This is achieved through changes in pitch,
 * timing, and vocal stress. Emphasis helps convey importance, create contrast, or
 * indicate parenthetical information in a natural way.
 * 
 * The emphasis level affects how the text is spoken relative to the surrounding content.
 * Strong emphasis makes text stand out prominently, while reduced emphasis makes it
 * less prominent, useful for side notes or less important information.
 * 
 * @example
 * ```typescript
 * // Default emphasis (moderate)
 * const emphasis1 = new EmphasisElement('important');
 * emphasis1.render();
 * // Output: <emphasis>important</emphasis>
 * 
 * // Strong emphasis
 * const emphasis2 = new EmphasisElement('very important', 'strong');
 * emphasis2.render();
 * // Output: <emphasis level="strong">very important</emphasis>
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .text('This is ')
 *     .emphasis('extremely critical', 'strong')
 *     .text(' information.')
 *   .build();
 * ```
 * 
 * @remarks
 * - If no level is specified, 'moderate' is used as the default
 * - Emphasis can be nested within other emphasis elements for compound effects
 * - The actual acoustic realization varies by voice and language
 * - Overuse of emphasis can make speech sound unnatural
 * - Special XML characters in the text are automatically escaped
 * - Can be used within voice, paragraph, sentence, and other container elements
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#adjust-emphasis} Emphasis Element Documentation [[11]]
 * @see {@link https://www.w3.org/TR/speech-synthesis11/#S3.2.2} W3C SSML Emphasis Specification
 */
export class EmphasisElement extends SSMLElement {
  /**
   * The text content to be emphasized.
   * @private
   */
  private text: string;
  
  /**
   * The level of emphasis to apply.
   * @private
   */
  private level?: EmphasisLevel;

  /**
   * Creates a new EmphasisElement instance.
   * 
   * @param text - The text content to emphasize.
   *               This text will be spoken with the specified emphasis level.
   *               Special XML characters (&, <, >, ", ') are automatically escaped
   *               to ensure valid XML output and prevent injection attacks.
   * 
   * @param level - Optional emphasis level to apply to the text.
   *                Available levels:
   *                - `strong`: High emphasis with significant pitch increase and slower speech.
   *                            Used for critical information or strong contrast.
   *                - `moderate`: Medium emphasis (default if not specified).
   *                              Standard emphasis for important information.
   *                - `reduced`: De-emphasis with lower pitch and faster speech.
   *                            Used for parenthetical or less important information.
   * 
   * @example
   * ```typescript
   * // Default emphasis (moderate)
   * const normal = new EmphasisElement('important information');
   * 
   * // Strong emphasis for warnings
   * const warning = new EmphasisElement('WARNING', 'strong');
   * 
   * // Reduced emphasis for side notes
   * const sideNote = new EmphasisElement('(optional)', 'reduced');
   * 
   * // With special characters (automatically escaped)
   * const special = new EmphasisElement('Terms & Conditions', 'strong');
   * 
   * // For highlighting key points
   * const keyPoint = new EmphasisElement('Remember this', 'strong');
   * 
   * // For de-emphasizing disclaimers
   * const disclaimer = new EmphasisElement('results may vary', 'reduced');
   * ```
   */
  constructor(text: string, level?: EmphasisLevel) {
    super();
    this.text = text;
    this.level = level;
  }

  /**
   * Renders the emphasis element as an SSML XML string.
   * 
   * Generates the `<emphasis>` element with optional level attribute and properly
   * escaped text content. The level attribute is only included if explicitly specified;
   * otherwise, the default 'moderate' level is implied. Text content is automatically
   * escaped to prevent XML injection and ensure valid output.
   * 
   * @returns The XML string representation of the emphasis element in one of these formats:
   *          - `<emphasis>text</emphasis>` (default moderate level)
   *          - `<emphasis level="strong">text</emphasis>` (explicit level)
   * 
   * @example
   * ```typescript
   * // Default emphasis (no level attribute)
   * const emphasis1 = new EmphasisElement('important');
   * console.log(emphasis1.render());
   * // Output: <emphasis>important</emphasis>
   * 
   * // With strong level
   * const emphasis2 = new EmphasisElement('critical', 'strong');
   * console.log(emphasis2.render());
   * // Output: <emphasis level="strong">critical</emphasis>
   * 
   * // With reduced level
   * const emphasis3 = new EmphasisElement('minor detail', 'reduced');
   * console.log(emphasis3.render());
   * // Output: <emphasis level="reduced">minor detail</emphasis>
   * 
   * // Special characters are escaped
   * const emphasis4 = new EmphasisElement('A & B are "important"', 'strong');
   * console.log(emphasis4.render());
   * // Output: <emphasis level="strong">A &amp; B are &quot;important&quot;</emphasis>
   * ```
   * 
   * @override
   */
  render(): string {
    const levelAttr = this.level ? ` level="${this.level}"` : '';
    return `<emphasis${levelAttr}>${this.escapeXml(this.text)}</emphasis>`;
  }
}
