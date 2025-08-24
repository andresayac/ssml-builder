import { SSMLElement } from '../core/SSMLElement';
import { type BreakOptions } from '../types';

/**
 * SSML element for inserting pauses or breaks in synthesized speech.
 * 
 * The `<break>` element provides control over pauses between words or sentences in the speech output.
 * It can be used to add natural pauses for better comprehension, create dramatic effects,
 * or override the default pause behavior of the speech synthesizer. Breaks can be specified
 * either semantically (using strength levels) or with explicit durations.
 * 
 * The Speech service automatically inserts pauses based on punctuation and sentence structure,
 * but the break element allows you to customize this behavior for more natural or expressive speech.
 * 
 * @example
 * ```typescript
 * // Default break (medium strength, 750ms)
 * const defaultBreak = new BreakElement();
 * defaultBreak.render();
 * // Output: <break/>
 * 
 * // Break with specific duration
 * const timedBreak = new BreakElement({ time: '500ms' });
 * timedBreak.render();
 * // Output: <break time="500ms"/>
 * 
 * // Break with strength level
 * const strongBreak = new BreakElement({ strength: 'strong' });
 * strongBreak.render();
 * // Output: <break strength="strong"/>
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .text('First part')
 *     .break('2s')  // 2 second pause
 *     .text('Second part')
 *   .build();
 * ```
 * 
 * @remarks
 * - If no options are provided, a default medium-strength break (750ms) is inserted
 * - The `time` attribute takes precedence over `strength` if both are specified
 * - Valid time range is 0-20000ms (20 seconds maximum)
 * - Values exceeding 20000ms are automatically capped at 20000ms
 * - Breaks can be inserted anywhere within text content
 * - Multiple consecutive breaks are additive in duration
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-a-break} Break Element Documentation [[11]]
 * @see {@link https://www.w3.org/TR/speech-synthesis11/#S3.2.3} W3C SSML Break Element Specification
 */
export class BreakElement extends SSMLElement {
  /**
   * Optional configuration for the break element.
   * @private
   */
  private options?: BreakOptions;

  /**
   * Creates a new BreakElement instance.
   * 
   * @param options - Optional configuration for the break element.
   *                  If not provided, creates a default break with medium strength (750ms).
   * @param options.strength - Semantic strength of the pause. Each level has a predefined duration:
   *                          - `x-weak`: 250ms (very short pause, barely noticeable)
   *                          - `weak`: 500ms (short pause, like after a comma)
   *                          - `medium`: 750ms (default, like after a period)
   *                          - `strong`: 1000ms (long pause, like between paragraphs)
   *                          - `x-strong`: 1250ms (very long pause, for emphasis)
   *                          Ignored if `time` is also specified.
   * @param options.time - Explicit duration of the pause.
   *                      Can be specified in seconds (e.g., '2s') or milliseconds (e.g., '500ms').
   *                      Valid range: 0-20000ms. Values above 20000ms are capped at 20000ms.
   *                      Takes precedence over `strength` if both are provided.
   * 
   * @example
   * ```typescript
   * // Default break (no options)
   * const defaultBreak = new BreakElement();
   * 
   * // Semantic strength breaks
   * const weakBreak = new BreakElement({ strength: 'weak' });      // 500ms
   * const mediumBreak = new BreakElement({ strength: 'medium' });  // 750ms
   * const strongBreak = new BreakElement({ strength: 'strong' });  // 1000ms
   * 
   * // Explicit duration breaks
   * const halfSecond = new BreakElement({ time: '500ms' });
   * const twoSeconds = new BreakElement({ time: '2s' });
   * const precise = new BreakElement({ time: '1250ms' });
   * 
   * // Both specified (time takes precedence)
   * const override = new BreakElement({ 
   *   strength: 'weak',  // Ignored
   *   time: '3s'         // This is used
   * });
   * 
   * // For dramatic effect
   * const dramatic = new BreakElement({ time: '3000ms' });
   * 
   * // For natural speech flow
   * const natural = new BreakElement({ strength: 'medium' });
   * ```
   */
  constructor(options?: BreakOptions) {
    super();
    this.options = options;
  }

  /**
   * Renders the break element as an SSML XML string.
   * 
   * Generates the `<break>` element with appropriate attributes based on the provided options.
   * The element is self-closing and doesn't contain any content. The method handles three cases:
   * 1. No options: Renders a simple break element with default behavior
   * 2. With options: Includes strength and/or time attributes as specified
   * 3. Empty options: Falls back to default break element
   * 
   * The attributes are only included if their values are defined, keeping the XML clean
   * and avoiding unnecessary attributes.
   * 
   * @returns The XML string representation of the break element in one of these formats:
   *          - `<break/>` (default, no options)
   *          - `<break strength="value"/>` (with strength only)
   *          - `<break time="value"/>` (with time only)
   *          - `<break strength="value" time="value"/>` (both specified, time takes precedence)
   * 
   * @example
   * ```typescript
   * // Default break
   * const break1 = new BreakElement();
   * console.log(break1.render());
   * // Output: <break/>
   * 
   * // With strength
   * const break2 = new BreakElement({ strength: 'strong' });
   * console.log(break2.render());
   * // Output: <break strength="strong"/>
   * 
   * // With time
   * const break3 = new BreakElement({ time: '1500ms' });
   * console.log(break3.render());
   * // Output: <break time="1500ms"/>
   * 
   * // With both (time takes precedence in synthesis)
   * const break4 = new BreakElement({ 
   *   strength: 'weak', 
   *   time: '2s' 
   * });
   * console.log(break4.render());
   * // Output: <break strength="weak" time="2s"/>
   * // Note: When synthesized, only the time="2s" is used
   * ```
   * 
   * @override
   */
  render(): string {
    if (!this.options) {
      return '<break/>';
    }

    const attrs: string[] = [];
    if (this.options.strength) {
      attrs.push(`strength="${this.options.strength}"`);
    }
    if (this.options.time) {
      attrs.push(`time="${this.options.time}"`);
    }

    return attrs.length > 0 
      ? `<break ${attrs.join(' ')}/>`
      : '<break/>';
  }
}
