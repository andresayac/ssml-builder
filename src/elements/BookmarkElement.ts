import { SSMLElement } from '../core/SSMLElement';

/**
 * SSML element for placing markers in speech synthesis to track progress.
 * 
 * The `<bookmark>` element inserts a non-audible marker at a specific location in the
 * synthesized speech stream. These markers generate events that can be tracked by applications
 * to determine exactly when specific points in the text are reached during playback.
 * This is useful for synchronizing visual elements, triggering animations, or tracking
 * reading progress.
 * 
 * The bookmark element itself doesn't produce any audio output - it's purely a marker
 * for event generation. Applications can subscribe to the `BookmarkReached` event using
 * the Speech SDK to receive notifications when each bookmark is encountered during synthesis.
 * 
 * @example
 * ```typescript
 * // Simple bookmark
 * const bookmark = new BookmarkElement('section_1');
 * bookmark.render();
 * // Output: <bookmark mark="section_1"/>
 * 
 * // Use with SSMLBuilder for tracking word positions
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .text('We are selling ')
 *     .bookmark('flower_1')
 *     .text('roses and ')
 *     .bookmark('flower_2')
 *     .text('daisies.')
 *   .build();
 * 
 * // For synchronizing with animations
 * const animatedSSML = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .bookmark('animation_start')
 *     .text('The rocket launches')
 *     .bookmark('animation_peak')
 *     .text('into the sky')
 *     .bookmark('animation_end')
 *   .build();
 * ```
 * 
 * @remarks
 * - Bookmark elements are self-closing and cannot contain text or other elements
 * - The mark attribute value should be unique within the document for proper identification
 * - Bookmarks don't affect speech timing, pauses, or pronunciation
 * - To receive bookmark events, use the Speech SDK's BookmarkReached event handler
 * - Useful for creating karaoke-style applications or read-along experiences
 * - Can be placed anywhere within voice, paragraph, or sentence elements
 * - The time offset of each bookmark can be retrieved through the SDK events
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#bookmark-element} Bookmark Element Documentation
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-speech-synthesis#subscribe-to-synthesizer-events} Subscribe to Synthesizer Events
 */
export class BookmarkElement extends SSMLElement {
  /**
   * The reference identifier for this bookmark.
   * @private
   */
  private mark: string;

  /**
   * Creates a new BookmarkElement instance.
   * 
   * @param mark - The reference identifier for the bookmark.
   *               This should be a unique string within the SSML document
   *               that identifies this specific marker position.
   *               Used by event handlers to identify which bookmark was reached.
   *               Can contain letters, numbers, and underscores.
   *               Avoid spaces and special characters for better compatibility.
   * 
   * @example
   * ```typescript
   * // Simple identifier
   * const bookmark1 = new BookmarkElement('start');
   * 
   * // Numbered markers
   * const bookmark2 = new BookmarkElement('word_1');
   * const bookmark3 = new BookmarkElement('word_2');
   * 
   * // Hierarchical markers
   * const chapterStart = new BookmarkElement('chapter_1_start');
   * const sectionStart = new BookmarkElement('chapter_1_section_2');
   * 
   * // For tracking specific content
   * const priceBookmark = new BookmarkElement('price_announcement');
   * const dateBookmark = new BookmarkElement('date_mentioned');
   * 
   * // For animation sync points
   * const animStart = new BookmarkElement('anim_slide_in');
   * const animMid = new BookmarkElement('anim_highlight');
   * const animEnd = new BookmarkElement('anim_slide_out');
   * ```
   */
  constructor(mark: string) {
    super();
    this.mark = mark;
  }

  /**
   * Renders the bookmark element as an SSML XML string.
   * 
   * Generates the `<bookmark>` element with the mark attribute. This is a self-closing
   * element that doesn't contain any content or child elements. The mark value is
   * inserted directly without escaping since it should only contain safe identifier characters.
   * 
   * @returns The XML string representation of the bookmark element in the format:
   *          `<bookmark mark="identifier"/>`
   * 
   * @example
   * ```typescript
   * // Simple bookmark
   * const bookmark = new BookmarkElement('intro');
   * console.log(bookmark.render());
   * // Output: <bookmark mark="intro"/>
   * 
   * // Numbered bookmark
   * const wordMarker = new BookmarkElement('word_42');
   * console.log(wordMarker.render());
   * // Output: <bookmark mark="word_42"/>
   * 
   * // Hierarchical bookmark
   * const section = new BookmarkElement('chapter2_section3_para1');
   * console.log(section.render());
   * // Output: <bookmark mark="chapter2_section3_para1"/>
   * 
   * // Usage in speech synthesis with SDK event handling
   * // When synthesized, this bookmark will trigger a BookmarkReached event
   * // with the mark value and audio offset position
   * ```
   * 
   * @override
   */
  render(): string {
    return `<bookmark mark="${this.mark}"/>`;
  }
}
