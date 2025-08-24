import { SSMLElement } from '../core/SSMLElement';
import type { SayAsOptions } from '../types';

/**
 * SSML element for controlling text interpretation and pronunciation.
 * 
 * The `<say-as>` element specifies how text should be interpreted and spoken by the
 * text-to-speech engine. This is essential for ensuring correct pronunciation of
 * formatted text such as dates, numbers, currency, telephone numbers, and other
 * specialized content. Without this element, the synthesizer might incorrectly
 * interpret formatted text based on its default rules.
 * 
 * The say-as element ensures consistent and accurate pronunciation across different
 * voices and languages by providing explicit interpretation instructions. This is
 * particularly important for content that could be ambiguous, such as "1/2" which
 * could be a date or a fraction.
 * 
 * @example
 * ```typescript
 * // Date interpretation
 * const date = new SayAsElement('2025-12-31', {
 *   interpretAs: 'date',
 *   format: 'ymd'
 * });
 * date.render();
 * // Output: <say-as interpret-as="date" format="ymd">2025-12-31</say-as>
 * 
 * // Currency with detail
 * const price = new SayAsElement('42.50', {
 *   interpretAs: 'currency',
 *   detail: 'USD'
 * });
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .text('The meeting is on ')
 *     .sayAs('03/15/2025', { interpretAs: 'date', format: 'mdy' })
 *   .build();
 * ```
 * 
 * @remarks
 * - The say-as element can only contain text and no other elements
 * - Different voices and languages may support different interpretAs types
 * - The format and detail attributes provide additional context for interpretation
 * - Incorrect format specifications may result in unexpected pronunciation
 * - Special XML characters in text are automatically escaped
 * - Some interpretAs values are language-specific
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#say-as-element} Say-As Element Documentation
 * @see {@link https://www.w3.org/TR/speech-synthesis11/#S3.1.9} W3C SSML Say-As Specification
 */
export class SayAsElement extends SSMLElement {
  /**
   * The text content to be interpreted.
   * @private
   */
  private text: string;
  
  /**
   * Configuration options for text interpretation.
   * @private
   */
  private options: SayAsOptions;

  /**
   * Creates a new SayAsElement instance.
   * 
   * @param text - The text content to be interpreted and spoken.
   *               This should be formatted according to the interpretAs type.
   *               Special XML characters (&, <, >, ", ') are automatically escaped.
   *               Examples:
   *               - For dates: "2025-12-31", "12/31/2025", "31.12.2025"
   *               - For currency: "42.50", "$100", "€50.00"
   *               - For telephone: "1-800-555-1234", "+1 (555) 123-4567"
   *               - For numbers: "1234", "42", "3.14159"
   * 
   * @param options - Configuration for text interpretation
   * @param options.interpretAs - How to interpret the text (required). Valid values:
   *                             - `address`: Street addresses
   *                             - `cardinal`: Cardinal numbers (1, 2, 3)
   *                             - `characters`: Spell out each character
   *                             - `date`: Date values
   *                             - `digits`: Speak each digit individually
   *                             - `fraction`: Fractions (1/2, 3/4)
   *                             - `ordinal`: Ordinal numbers (1st, 2nd, 3rd)
   *                             - `spell-out`: Spell out the entire word
   *                             - `telephone`: Phone numbers
   *                             - `time`: Time values
   *                             - `name`: Personal names
   *                             - `currency`: Monetary amounts
   * @param options.format - Optional format hint for interpretation. Common formats:
   *                        For dates:
   *                        - `mdy`: Month-day-year (12/31/2025)
   *                        - `dmy`: Day-month-year (31/12/2025)
   *                        - `ymd`: Year-month-day (2025-12-31)
   *                        - `md`: Month-day (12/31)
   *                        - `dm`: Day-month (31/12)
   *                        - `ym`: Year-month (2025/12)
   *                        - `my`: Month-year (12/2025)
   *                        - `d`: Day only
   *                        - `m`: Month only
   *                        - `y`: Year only
   *                        For time:
   *                        - `hms12`: 12-hour format with seconds
   *                        - `hms24`: 24-hour format with seconds
   * @param options.detail - Optional additional detail for interpretation.
   *                        Most commonly used for currency to specify the currency code
   *                        (USD, EUR, GBP, JPY, etc.)
   * 
   * @example
   * ```typescript
   * // Date examples
   * const usDate = new SayAsElement('03/15/2025', {
   *   interpretAs: 'date',
   *   format: 'mdy'
   * });
   * 
   * const isoDate = new SayAsElement('2025-03-15', {
   *   interpretAs: 'date',
   *   format: 'ymd'
   * });
   * 
   * // Currency examples
   * const usDollars = new SayAsElement('42.50', {
   *   interpretAs: 'currency',
   *   detail: 'USD'
   * });
   * 
   * const euros = new SayAsElement('100.00', {
   *   interpretAs: 'currency',
   *   detail: 'EUR'
   * });
   * 
   * // Number examples
   * const cardinal = new SayAsElement('42', {
   *   interpretAs: 'cardinal'  // "forty-two"
   * });
   * 
   * const ordinal = new SayAsElement('3', {
   *   interpretAs: 'ordinal'  // "third"
   * });
   * 
   * const digits = new SayAsElement('123', {
   *   interpretAs: 'digits'  // "one two three"
   * });
   * 
   * // Phone number
   * const phone = new SayAsElement('1-800-555-1234', {
   *   interpretAs: 'telephone'
   * });
   * 
   * // Time
   * const time = new SayAsElement('14:30:00', {
   *   interpretAs: 'time',
   *   format: 'hms24'
   * });
   * 
   * // Spell out
   * const spelled = new SayAsElement('API', {
   *   interpretAs: 'spell-out'  // "A P I"
   * });
   * ```
   */
  constructor(text: string, options: SayAsOptions) {
    super();
    this.text = text;
    this.options = options;
  }

  /**
   * Renders the say-as element as an SSML XML string.
   * 
   * Generates the `<say-as>` element with the required interpret-as attribute
   * and optional format and detail attributes. The text content is automatically
   * escaped to prevent XML injection and ensure valid output. Only includes
   * optional attributes if their values are defined, keeping the XML clean.
   * 
   * @returns The XML string representation of the say-as element with format:
   *          `<say-as interpret-as="type" [format="value"] [detail="value"]>text</say-as>`
   * 
   * @example
   * ```typescript
   * // Basic interpretation
   * const cardinal = new SayAsElement('42', { interpretAs: 'cardinal' });
   * console.log(cardinal.render());
   * // Output: <say-as interpret-as="cardinal">42</say-as>
   * 
   * // With format
   * const date = new SayAsElement('2025-12-31', {
   *   interpretAs: 'date',
   *   format: 'ymd'
   * });
   * console.log(date.render());
   * // Output: <say-as interpret-as="date" format="ymd">2025-12-31</say-as>
   * 
   * // With detail
   * const currency = new SayAsElement('42.50', {
   *   interpretAs: 'currency',
   *   detail: 'USD'
   * });
   * console.log(currency.render());
   * // Output: <say-as interpret-as="currency" detail="USD">42.50</say-as>
   * 
   * // All attributes
   * const complex = new SayAsElement('3:30:00 PM', {
   *   interpretAs: 'time',
   *   format: 'hms12',
   *   detail: 'EST'
   * });
   * console.log(complex.render());
   * // Output: <say-as interpret-as="time" format="hms12" detail="EST">3:30:00 PM</say-as>
   * 
   * // Special characters escaped
   * const special = new SayAsElement('A&B', {
   *   interpretAs: 'spell-out'
   * });
   * console.log(special.render());
   * // Output: <say-as interpret-as="spell-out">A&amp;B</say-as>
   * ```
   * 
   * @override
   */
  render(): string {
    const attrs: string[] = [`interpret-as="${this.options.interpretAs}"`];
    
    if (this.options.format) {
      attrs.push(`format="${this.options.format}"`);
    }
    if (this.options.detail) {
      attrs.push(`detail="${this.options.detail}"`);
    }
    
    return `<say-as ${attrs.join(' ')}>${this.escapeXml(this.text)}</say-as>`;
  }
}
