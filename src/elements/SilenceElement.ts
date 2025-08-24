import { SSMLElement } from '../core/SSMLElement';
import type { SilenceOptions } from '../types';

/**
 * SSML element for inserting precise silence/pauses in speech synthesis (Azure-specific).
 * 
 * The `<mstts:silence>` element provides fine-grained control over silence placement in
 * synthesized speech. Unlike the break element which can be inserted anywhere, the silence
 * element works specifically at text boundaries: beginning or end of input text, between
 * sentences, or at punctuation marks. This Azure Speech Service specific element allows
 * for both additive silence (adding to natural pauses) and absolute silence (replacing
 * natural pauses) for precise timing control.
 * 
 * The silence setting is applied to all input text within its enclosing voice element.
 * To reset or change the silence setting, you must use a new voice element with either
 * the same voice or a different voice.
 * 
 * @example
 * ```typescript
 * // Add 200ms between sentences
 * const silence = new SilenceElement({
 *   type: 'Sentenceboundary',
 *   value: '200ms'
 * });
 * silence.render();
 * // Output: <mstts:silence type="Sentenceboundary" value="200ms"/>
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .silence({ type: 'Leading', value: '500ms' })
 *     .text('This text has extra silence at the beginning.')
 *   .build();
 * ```
 * 
 * @remarks
 * - This is an Azure Speech Service specific extension requiring the mstts namespace
 * - Silence elements must be direct children of the voice element
 * - Absolute silence types (with -exact suffix) replace natural silence completely
 * - Non-absolute types add to existing natural silence
 * - The WordBoundary event takes precedence over punctuation-related silence settings
 * - Multiple silence elements can be used for different types within the same voice
 * - Valid duration range is 0-20000ms (values above 20000ms are capped)
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-silence} Silence Element Documentation
 */
export class SilenceElement extends SSMLElement {
  /**
   * Configuration options for the silence element.
   * @private
   */
  private options: SilenceOptions;

  /**
   * Creates a new SilenceElement instance.
   * 
   * @param options - Configuration for the silence element
   * @param options.type - Specifies where and how to add silence (required).
   *                       Available types:
   *                       - `Leading`: Extra silence at the beginning (added to natural silence)
   *                       - `Leading-exact`: Absolute silence at the beginning (replaces natural silence)
   *                       - `Tailing`: Extra silence at the end (added to natural silence)
   *                       - `Tailing-exact`: Absolute silence at the end (replaces natural silence)
   *                       - `Sentenceboundary`: Extra silence between sentences (added to natural pauses)
   *                       - `Sentenceboundary-exact`: Absolute silence between sentences (replaces natural pauses)
   *                       - `Comma-exact`: Absolute silence at commas (half/full-width)
   *                       - `Semicolon-exact`: Absolute silence at semicolons (half/full-width)
   *                       - `Enumerationcomma-exact`: Absolute silence at enumeration commas (full-width, CJK languages)
   * @param options.value - Duration of silence in seconds (e.g., '2s') or milliseconds (e.g., '500ms').
   *                        Valid range: 0-20000 milliseconds.
   *                        Values greater than 20000ms are automatically capped at 20000ms.
   * 
   * @example
   * ```typescript
   * // Add extra silence at the beginning
   * const leadingSilence = new SilenceElement({
   *   type: 'Leading',
   *   value: '1s'
   * });
   * 
   * // Replace natural silence at the beginning
   * const exactLeading = new SilenceElement({
   *   type: 'Leading-exact',
   *   value: '500ms'
   * });
   * 
   * // Add silence between sentences
   * const sentencePause = new SilenceElement({
   *   type: 'Sentenceboundary',
   *   value: '300ms'
   * });
   * 
   * // Set exact silence at commas
   * const commaPause = new SilenceElement({
   *   type: 'Comma-exact',
   *   value: '150ms'
   * });
   * 
   * // For dramatic effect with long pause
   * const dramatic = new SilenceElement({
   *   type: 'Sentenceboundary',
   *   value: '2000ms'
   * });
   * 
   * // Minimal silence for rapid speech
   * const rapid = new SilenceElement({
   *   type: 'Sentenceboundary-exact',
   *   value: '50ms'
   * });
   * 
   * // For CJK languages with enumeration comma
   * const cjkPause = new SilenceElement({
   *   type: 'Enumerationcomma-exact',
   *   value: '200ms'
   * });
   * ```
   */
  constructor(options: SilenceOptions) {
    super();
    this.options = options;
  }

  /**
   * Renders the silence element as an SSML XML string.
   * 
   * Generates the Azure-specific `<mstts:silence>` element with the type and value
   * attributes. This is a self-closing element that doesn't contain any content or
   * child elements. The element instructs the speech synthesizer to insert or modify
   * silence at the specified positions.
   * 
   * @returns The XML string representation of the silence element in the format:
   *          `<mstts:silence type="type" value="duration"/>`
   * 
   * @example
   * ```typescript
   * // Sentence boundary silence
   * const sentence = new SilenceElement({
   *   type: 'Sentenceboundary',
   *   value: '500ms'
   * });
   * console.log(sentence.render());
   * // Output: <mstts:silence type="Sentenceboundary" value="500ms"/>
   * 
   * // Leading silence
   * const leading = new SilenceElement({
   *   type: 'Leading-exact',
   *   value: '1s'
   * });
   * console.log(leading.render());
   * // Output: <mstts:silence type="Leading-exact" value="1s"/>
   * 
   * // Comma pause
   * const comma = new SilenceElement({
   *   type: 'Comma-exact',
   *   value: '200ms'
   * });
   * console.log(comma.render());
   * // Output: <mstts:silence type="Comma-exact" value="200ms"/>
   * 
   * // Maximum duration (capped)
   * const max = new SilenceElement({
   *   type: 'Tailing',
   *   value: '20000ms'
   * });
   * console.log(max.render());
   * // Output: <mstts:silence type="Tailing" value="20000ms"/>
   * ```
   * 
   * @override
   */
  render(): string {
    return `<mstts:silence type="${this.options.type}" value="${this.options.value}"/>`;
  }
}
