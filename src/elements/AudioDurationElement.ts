import { SSMLElement } from '../core/SSMLElement';

/**
 * SSML element for controlling the total audio duration (Azure-specific).
 * 
 * The `<mstts:audioduration>` element adjusts the speech rate to make the audio output
 * fit within a specified duration. This is useful for synchronizing speech with video,
 * animations, or when you need precise timing control. The speech synthesizer will
 * automatically speed up or slow down the speech to match the target duration.
 * 
 * This is an Azure Speech Service specific extension and requires the mstts namespace.
 * If the specified duration is shorter than the natural speech duration, the speech
 * will be sped up. If longer, the speech will be slowed down.
 * 
 * @example
 * ```typescript
 * // Force speech to last exactly 10 seconds
 * const element = new AudioDurationElement('10s');
 * element.render();
 * // Output: <mstts:audioduration value="10s"/>
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .audioDuration('5s')
 *     .text('This text will be adjusted to last exactly 5 seconds.')
 *   .build();
 * ```
 * 
 * @remarks
 * - The audio duration affects all speech content that follows it within the same voice element
 * - The speech rate adjustment may affect speech quality if the adjustment is too extreme
 * - Consider using prosody rate adjustments for minor timing changes instead
 * - This element cannot contain text or other elements
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#audioduration} AudioDuration Documentation
 * @see {@link https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup#msttsaudioduration} Azure SSML AudioDuration Reference
 */
export class AudioDurationElement extends SSMLElement {
  /**
   * The target duration value for the audio output.
   * @private
   */
  private value: string;

  /**
   * Creates a new AudioDurationElement instance.
   * 
   * @param value - The target duration for the audio output.
   *                Must be specified in seconds (e.g., '10s') or milliseconds (e.g., '5000ms').
   *                The speech synthesizer will adjust the speaking rate to fit this duration.
   *                Valid range typically 0.5x to 2x the natural duration.
   * 
   * @example
   * ```typescript
   * // Create with seconds
   * const duration1 = new AudioDurationElement('10s');
   * 
   * // Create with milliseconds
   * const duration2 = new AudioDurationElement('5000ms');
   * 
   * // Create for video synchronization
   * const videoDuration = new AudioDurationElement('30s');
   * ```
   * 
   * @throws {Error} Throws an error if value is not provided (compile-time in TypeScript)
   */
  constructor(value: string) {
    super();
    this.value = value;
  }

  /**
   * Renders the audio duration element as an SSML XML string.
   * 
   * Generates the Azure-specific `<mstts:audioduration>` element with the specified
   * duration value. This element is self-closing and does not contain any child elements.
   * 
   * @returns The XML string representation of the audio duration element in the format:
   *          `<mstts:audioduration value="duration"/>`
   * 
   * @example
   * ```typescript
   * const element = new AudioDurationElement('15s');
   * console.log(element.render());
   * // Output: <mstts:audioduration value="15s"/>
   * 
   * // Different duration formats
   * const ms = new AudioDurationElement('10000ms');
   * console.log(ms.render());
   * // Output: <mstts:audioduration value="10000ms"/>
   * 
   * const seconds = new AudioDurationElement('7.5s');
   * console.log(seconds.render());
   * // Output: <mstts:audioduration value="7.5s"/>
   * ```
   * 
   * @override
   */
  render(): string {
    return `<mstts:audioduration value="${this.value}"/>`;
  }
}
