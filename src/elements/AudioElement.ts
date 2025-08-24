import { SSMLElement } from '../core/SSMLElement';

/**
 * SSML element for embedding external audio files in speech synthesis.
 * 
 * The `<audio>` element allows you to insert pre-recorded audio files into the synthesized speech output.
 * This is useful for adding sound effects, music, pre-recorded messages, or any other audio content
 * that should be played as part of the speech. If the audio file is unavailable or cannot be played,
 * the optional fallback text will be spoken instead.
 * 
 * The audio element supports common audio formats like MP3 and WAV. The audio file must be
 * publicly accessible via HTTPS for cloud-based speech services to retrieve and play it.
 * 
 * @example
 * ```typescript
 * // Basic audio element with fallback text
 * const audio = new AudioElement(
 *   'https://example.com/sound.mp3',
 *   'Sound effect here'
 * );
 * audio.render();
 * // Output: <audio src="https://example.com/sound.mp3">Sound effect here</audio>
 * 
 * // Audio without fallback
 * const music = new AudioElement('https://example.com/music.mp3');
 * music.render();
 * // Output: <audio src="https://example.com/sound.mp3"></audio>
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .text('And now, a sound effect: ')
 *     .audio('https://example.com/bell.mp3', 'Ding!')
 *   .build();
 * ```
 * 
 * @remarks
 * - The audio file must be accessible via HTTPS (not HTTP) for security reasons
 * - Supported formats typically include MP3, WAV, and other common audio formats
 * - The audio plays in its entirety unless interrupted
 * - If the audio file cannot be loaded, the fallback text is spoken using the current voice
 * - The audio element can be nested within voice, paragraph, and sentence elements
 * - Consider file size and network latency when using external audio files
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-recorded-audio} Audio Element Documentation
 * @see {@link https://www.w3.org/TR/speech-synthesis11/#S3.3.1} W3C SSML Audio Element Specification
 */
export class AudioElement extends SSMLElement {
  /**
   * The URL of the audio file to play.
   * @private
   */
  private src: string;
  
  /**
   * Optional fallback text to speak if the audio cannot be played.
   * @private
   */
  private fallbackText?: string;

  /**
   * Creates a new AudioElement instance.
   * 
   * @param src - The URL of the audio file to play.
   *              Must be a publicly accessible HTTPS URL.
   *              Supported formats include MP3, WAV, and other common audio formats.
   *              The URL should be properly encoded if it contains special characters.
   * 
   * @param fallbackText - Optional text to speak if the audio file is unavailable or cannot be played.
   *                       This text will be spoken using the current voice settings.
   *                       Special XML characters in the text will be automatically escaped.
   *                       If not provided and the audio fails, there will be silence.
   * 
   * @example
   * ```typescript
   * // With fallback text for accessibility
   * const soundEffect = new AudioElement(
   *   'https://cdn.example.com/sounds/notification.mp3',
   *   'Notification sound'
   * );
   * 
   * // Without fallback (silent if audio fails)
   * const backgroundMusic = new AudioElement(
   *   'https://cdn.example.com/music/intro.mp3'
   * );
   * 
   * // With special characters in fallback text (automatically escaped)
   * const alert = new AudioElement(
   *   'https://example.com/alert.mp3',
   *   'Alert: "System" & security check'
   * );
   * ```
   */
  constructor(src: string, fallbackText?: string) {
    super();
    this.src = src;
    this.fallbackText = fallbackText;
  }

  /**
   * Renders the audio element as an SSML XML string.
   * 
   * Generates the `<audio>` element with the source URL and optional fallback text.
   * If fallback text is provided, it is automatically escaped to prevent XML injection
   * and ensure valid XML output. The fallback text is placed inside the audio element
   * and will only be spoken if the audio file cannot be loaded or played.
   * 
   * @returns The XML string representation of the audio element in the format:
   *          `<audio src="url">fallback text</audio>` or
   *          `<audio src="url"></audio>` if no fallback text is provided
   * 
   * @example
   * ```typescript
   * // With fallback text
   * const audio1 = new AudioElement(
   *   'https://example.com/sound.mp3',
   *   'Ding sound'
   * );
   * console.log(audio1.render());
   * // Output: <audio src="https://example.com/sound.mp3">Ding sound</audio>
   * 
   * // Without fallback text
   * const audio2 = new AudioElement('https://example.com/music.mp3');
   * console.log(audio2.render());
   * // Output: <audio src="https://example.com/music.mp3"></audio>
   * 
   * // With special characters in fallback (automatically escaped)
   * const audio3 = new AudioElement(
   *   'https://example.com/alert.mp3',
   *   'Alert & "Warning"'
   * );
   * console.log(audio3.render());
   * // Output: <audio src="https://example.com/alert.mp3">Alert &amp; &quot;Warning&quot;</audio>
   * ```
   * 
   * @override
   */
  render(): string {
    const content = this.fallbackText 
      ? this.escapeXml(this.fallbackText) 
      : '';
    return `<audio src="${this.src}">${content}</audio>`;
  }
}
