import { SSMLElement } from '../core/SSMLElement';
import type { ProsodyOptions } from '../types';

/**
 * SSML element for modifying prosodic properties of speech.
 * 
 * The `<prosody>` element provides fine-grained control over various aspects of speech synthesis
 * including pitch, speaking rate, volume, and intonation patterns. This element is essential
 * for creating more natural and expressive synthesized speech by adjusting how text is spoken
 * rather than what is spoken. Prosody modifications can convey emotion, emphasis, or create
 * specific speaking styles like whispering or shouting.
 * 
 * All prosody attributes are optional and can be combined to achieve complex speech modifications.
 * The element affects all text and child elements within its scope, allowing for nested prosody
 * elements with cumulative effects.
 * 
 * @example
 * ```typescript
 * // Slow, quiet speech
 * const whisper = new ProsodyElement('This is a secret', {
 *   rate: 'slow',
 *   volume: 'soft',
 *   pitch: 'low'
 * });
 * whisper.render();
 * // Output: <prosody rate="slow" volume="soft" pitch="low">This is a secret</prosody>
 * 
 * // Excited speech
 * const excited = new ProsodyElement('Amazing news!', {
 *   rate: '1.2',
 *   pitch: '+10%',
 *   volume: 'loud'
 * });
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .prosody('Speaking slowly', { rate: 'slow' })
 *     .text(' and then ')
 *     .prosody('speaking quickly!', { rate: 'fast' })
 *   .build();
 * ```
 * 
 * @remarks
 * - All attributes are optional; if none are specified, default speech characteristics are used
 * - Prosody can be nested, with inner elements inheriting and modifying outer settings
 * - The prosody element can contain text and other elements including audio, break, p, phoneme, prosody, say-as, sub, and s [[11]]
 * - Extreme values may produce unnatural-sounding speech
 * - Special XML characters in text are automatically escaped
 * - Different voices may interpret prosody values slightly differently
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#adjust-prosody} Prosody Element Documentation [[8]]
 * @see {@link https://www.w3.org/TR/speech-synthesis11/#S3.2.4} W3C SSML Prosody Specification
 */
export class ProsodyElement extends SSMLElement {
  /**
   * The text content to be spoken with modified prosody.
   * @private
   */
  private text: string;
  
  /**
   * Configuration options for prosody modifications.
   * @private
   */
  private options: ProsodyOptions;

  /**
   * Creates a new ProsodyElement instance.
   * 
   * @param text - The text content to be spoken with modified prosody.
   *               Special XML characters (&, <, >, ", ') are automatically escaped.
   *               Can be any length of text from a single word to multiple paragraphs.
   * 
   * @param options - Configuration object for prosody modifications. All properties are optional.
   * @param options.pitch - Pitch adjustment for the speech. Can be:
   *                        - Absolute frequency: "80Hz" to "400Hz" for female, "50Hz" to "250Hz" for male
   *                        - Relative change: "+10Hz", "-2st" (semitones), "+10%", "-20%"
   *                        - Named values: "x-low", "low", "medium" (default), "high", "x-high"
   * @param options.contour - Fine control of pitch changes over time.
   *                          Format: "(position,pitch) (position,pitch) ..."
   *                          Position as percentage (0%-100%), pitch as Hz or percentage.
   *                          Example: "(0%,+20Hz) (50%,+10Hz) (100%,+5Hz)"
   * @param options.range - Variation in pitch range (monotone vs expressive).
   *                        Can be relative ("+10%", "-5st") or named values
   *                        ("x-low", "low", "medium", "high", "x-high")
   * @param options.rate - Speaking speed. Can be:
   *                       - Multiplier: "0.5" (half speed) to "2.0" (double speed)
   *                       - Percentage: "+25%", "-10%"
   *                       - Named values: "x-slow", "slow", "medium" (default), "fast", "x-fast"
   * @param options.volume - Volume level of speech. Can be:
   *                         - Numeric: "0" (silent) to "100" (loudest)
   *                         - Percentage: "50%", "80%"
   *                         - Decibels: "+10dB", "-5dB"
   *                         - Named values: "silent", "x-soft", "soft", "medium" (default), "loud", "x-loud"
   * 
   * @example
   * ```typescript
   * // Whisper effect
   * const whisper = new ProsodyElement('This is confidential', {
   *   volume: 'x-soft',
   *   rate: 'slow',
   *   pitch: 'low'
   * });
   * 
   * // Shouting effect
   * const shout = new ProsodyElement('Look out!', {
   *   volume: 'x-loud',
   *   pitch: 'high',
   *   rate: 'fast'
   * });
   * 
   * // Robot/monotone voice
   * const robot = new ProsodyElement('I am a robot', {
   *   pitch: 'medium',
   *   range: 'x-low',  // Minimal pitch variation
   *   rate: '0.9'
   * });
   * 
   * // Question intonation with contour
   * const question = new ProsodyElement('Are you sure', {
   *   contour: '(0%,+5Hz) (60%,+10Hz) (100%,+20Hz)'  // Rising intonation
   * });
   * 
   * // Emphasis with multiple attributes
   * const emphasis = new ProsodyElement('This is important', {
   *   pitch: '+10%',
   *   rate: '0.8',  // Slower
   *   volume: '+5dB'  // Louder
   * });
   * 
   * // Precise numeric control
   * const precise = new ProsodyElement('Precise control', {
   *   pitch: '150Hz',
   *   rate: '1.1',  // 10% faster
   *   volume: '75'   // 75% volume
   * });
   * ```
   */
  constructor(text: string, options: ProsodyOptions) {
    super();
    this.text = text;
    this.options = options;
  }

  /**
   * Renders the prosody element as an SSML XML string.
   * 
   * Generates the `<prosody>` element with only the specified attributes. Undefined
   * attributes are omitted from the output, keeping the XML clean. The text content
   * is automatically escaped to prevent XML injection and ensure valid output.
   * Attributes are rendered in a consistent order: pitch, contour, range, rate, volume.
   * 
   * @returns The XML string representation of the prosody element with format:
   *          `<prosody [pitch="value"] [contour="value"] [range="value"] [rate="value"] [volume="value"]>text</prosody>`
   *          If no attributes are specified, returns: `<prosody>text</prosody>`
   * 
   * @example
   * ```typescript
   * // Single attribute
   * const slow = new ProsodyElement('Slow speech', { rate: 'slow' });
   * console.log(slow.render());
   * // Output: <prosody rate="slow">Slow speech</prosody>
   * 
   * // Multiple attributes
   * const complex = new ProsodyElement('Complex prosody', {
   *   pitch: 'high',
   *   rate: 'fast',
   *   volume: 'loud'
   * });
   * console.log(complex.render());
   * // Output: <prosody pitch="high" rate="fast" volume="loud">Complex prosody</prosody>
   * 
   * // With contour
   * const contour = new ProsodyElement('Rising tone', {
   *   contour: '(0%,+0Hz) (100%,+20Hz)'
   * });
   * console.log(contour.render());
   * // Output: <prosody contour="(0%,+0Hz) (100%,+20Hz)">Rising tone</prosody>
   * 
   * // No attributes (valid but no effect)
   * const plain = new ProsodyElement('Plain text', {});
   * console.log(plain.render());
   * // Output: <prosody>Plain text</prosody>
   * 
   * // Special characters escaped
   * const special = new ProsodyElement('Terms & "conditions"', {
   *   volume: 'soft'
   * });
   * console.log(special.render());
   * // Output: <prosody volume="soft">Terms &amp; &quot;conditions&quot;</prosody>
   * ```
   * 
   * @override
   */
  render(): string {
    const attrs: string[] = [];
    
    if (this.options.pitch) attrs.push(`pitch="${this.options.pitch}"`);
    if (this.options.contour) attrs.push(`contour="${this.options.contour}"`);
    if (this.options.range) attrs.push(`range="${this.options.range}"`);
    if (this.options.rate) attrs.push(`rate="${this.options.rate}"`);
    if (this.options.volume) attrs.push(`volume="${this.options.volume}"`);
    
    const attrsStr = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
    return `<prosody${attrsStr}>${this.escapeXml(this.text)}</prosody>`;
  }
}
