import { SSMLElement } from '../core/SSMLElement';
import { type BackgroundAudioOptions } from '../types';

/**
 * SSML element for adding background audio to the entire speech output (Azure-specific).
 * 
 * The `<mstts:backgroundaudio>` element plays audio continuously throughout the entire SSML document,
 * behind all spoken content. This is useful for adding ambient music, sound effects, or any audio
 * atmosphere that enhances the listening experience. The background audio automatically loops if
 * it's shorter than the speech duration and is trimmed if longer.
 * 
 * This is an Azure Speech Service specific extension and requires the mstts namespace.
 * Only one background audio element can be used per SSML document, and it must be placed
 * as a direct child of the `<speak>` element, before any `<voice>` elements.
 * 
 * @example
 * ```typescript
 * // Basic background audio
 * const bgAudio = new BackgroundAudioElement({
 *   src: 'https://example.com/music.mp3'
 * });
 * bgAudio.render();
 * // Output: <mstts:backgroundaudio src="https://example.com/music.mp3"/>
 * 
 * // With all options
 * const fullBgAudio = new BackgroundAudioElement({
 *   src: 'https://example.com/ambient.mp3',
 *   volume: '0.5',
 *   fadein: '3000ms',
 *   fadeout: '2000ms'
 * });
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .backgroundAudio({
 *     src: 'https://example.com/background.mp3',
 *     volume: '0.3',
 *     fadein: '2000ms'
 *   })
 *   .voice('en-US-AvaNeural')
 *     .text('This speech has background music playing softly.')
 *   .build();
 * ```
 * 
 * @remarks
 * - The audio file must be accessible via HTTPS (not HTTP)
 * - Supported formats include MP3, WAV, and other common audio formats
 * - The audio automatically loops if shorter than the speech duration
 * - The audio is trimmed if longer than the speech duration
 * - Only one background audio element is allowed per SSML document
 * - Must be a direct child of the speak element, placed before voice elements
 * - Consider file size and bandwidth when using background audio
 * - The background audio doesn't affect speech timing or pauses
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-background-audio} Background Audio Documentation
 */
export class BackgroundAudioElement extends SSMLElement {
  /**
   * Configuration options for the background audio.
   * @private
   */
  private options: BackgroundAudioOptions;

  /**
   * Creates a new BackgroundAudioElement instance.
   * 
   * @param options - Configuration object for the background audio element
   * @param options.src - The URL of the audio file to play in the background.
   *                      Must be a publicly accessible HTTPS URL.
   *                      The audio will loop if shorter than speech duration.
   * @param options.volume - Optional volume level for the background audio.
   *                         Can be specified as:
   *                         - Decimal: "0.0" (silent) to "1.0" (full volume)
   *                         - Percentage: "0%" to "100%"
   *                         - Decibels: "+0dB", "-6dB" (negative values reduce volume)
   *                         Default is "1.0" (full volume)
   * @param options.fadein - Optional fade-in duration at the start.
   *                         Gradually increases volume from 0 to the specified level.
   *                         Format: milliseconds (e.g., "2000ms") or seconds (e.g., "2s")
   * @param options.fadeout - Optional fade-out duration at the end.
   *                          Gradually decreases volume to 0 before speech ends.
   *                          Format: milliseconds (e.g., "1500ms") or seconds (e.g., "1.5s")
   * 
   * @example
   * ```typescript
   * // Minimal configuration
   * const simple = new BackgroundAudioElement({
   *   src: 'https://cdn.example.com/ambient.mp3'
   * });
   * 
   * // With volume control
   * const withVolume = new BackgroundAudioElement({
   *   src: 'https://cdn.example.com/music.mp3',
   *   volume: '0.3'  // 30% volume
   * });
   * 
   * // Full configuration with fades
   * const full = new BackgroundAudioElement({
   *   src: 'https://cdn.example.com/soundtrack.mp3',
   *   volume: '0.5',      // 50% volume
   *   fadein: '3000ms',   // 3-second fade in
   *   fadeout: '2000ms'   // 2-second fade out
   * });
   * 
   * // For podcast/narration
   * const podcast = new BackgroundAudioElement({
   *   src: 'https://example.com/podcast-intro.mp3',
   *   volume: '-10dB',    // Reduced by 10 decibels
   *   fadein: '5s',       // Slow 5-second fade in
   *   fadeout: '3s'       // 3-second fade out
   * });
   * ```
   */
  constructor(options: BackgroundAudioOptions) {
    super();
    this.options = options;
  }

  /**
   * Renders the background audio element as an SSML XML string.
   * 
   * Generates the Azure-specific `<mstts:backgroundaudio>` element with the specified
   * audio source and optional volume/fade settings. This element is self-closing and
   * does not contain any child elements. The attributes are only included if their
   * corresponding option values are provided.
   * 
   * @returns The XML string representation of the background audio element in the format:
   *          `<mstts:backgroundaudio src="url" [volume="value"] [fadein="duration"] [fadeout="duration"]/>`
   * 
   * @example
   * ```typescript
   * // Minimal output
   * const basic = new BackgroundAudioElement({
   *   src: 'https://example.com/music.mp3'
   * });
   * console.log(basic.render());
   * // Output: <mstts:backgroundaudio src="https://example.com/music.mp3"/>
   * 
   * // With volume
   * const withVol = new BackgroundAudioElement({
   *   src: 'https://example.com/music.mp3',
   *   volume: '0.5'
   * });
   * console.log(withVol.render());
   * // Output: <mstts:backgroundaudio src="https://example.com/music.mp3" volume="0.5"/>
   * 
   * // Full configuration
   * const full = new BackgroundAudioElement({
   *   src: 'https://example.com/music.mp3',
   *   volume: '0.3',
   *   fadein: '2000ms',
   *   fadeout: '1500ms'
   * });
   * console.log(full.render());
   * // Output: <mstts:backgroundaudio src="https://example.com/music.mp3" volume="0.3" fadein="2000ms" fadeout="1500ms"/>
   * ```
   * 
   * @override
   */
  render(): string {
    const attrs: string[] = [`src="${this.options.src}"`];
    
    if (this.options.volume) {
      attrs.push(`volume="${this.options.volume}"`);
    }
    if (this.options.fadein) {
      attrs.push(`fadein="${this.options.fadein}"`);
    }
    if (this.options.fadeout) {
      attrs.push(`fadeout="${this.options.fadeout}"`);
    }
    
    return `<mstts:backgroundaudio ${attrs.join(' ')}/>`;
  }
}
