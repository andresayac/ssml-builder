import { SSMLElement } from '../core/SSMLElement';

/**
 * SSML element for generating viseme events for lip-sync animation (Azure-specific).
 * 
 * The `<mstts:viseme>` element enables the generation of viseme (visual phoneme) events during
 * speech synthesis. Visemes represent the visual positions of the mouth, lips, and face that
 * correspond to spoken phonemes. This Azure Speech Service specific feature is essential for
 * creating realistic lip-sync animations for avatars, animated characters, or virtual assistants.
 * 
 * When this element is included, the speech synthesizer generates time-aligned viseme data that
 * can be used by 3D rendering engines or animation systems to synchronize facial movements with
 * the audio output. Each viseme event includes timing information and blend shape data that
 * defines how the face should be positioned at that moment in the speech.
 * 
 * @example
 * ```typescript
 * // Basic viseme element for front-facing animation
 * const viseme = new VisemeElement('redlips_front');
 * viseme.render();
 * // Output: <mstts:viseme type="redlips_front"/>
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .viseme('redlips_front')
 *     .text('Hello, this text will generate viseme events for lip-sync.')
 *   .build();
 * ```
 * 
 * @remarks
 * - This is an Azure Speech Service specific extension requiring the mstts namespace
 * - The viseme element is self-closing and cannot contain text or other elements [[11]]
 * - Viseme events are generated for all speech following this element within the same voice
 * - The actual viseme events are received through the Speech SDK's VisemeReceived event
 * - Viseme data includes timing information and blend shape values for facial animation [[1]]
 * - Common use cases include avatar animation, virtual assistants, and video game characters
 * - The viseme type determines the format and style of the generated viseme data
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-speech-synthesis-viseme} Get facial position with viseme [[3]]
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup} Azure SSML Documentation [[11]]
 */
export class VisemeElement extends SSMLElement {
  /**
   * The type of viseme data to generate.
   * @private
   */
  private type: string;

  /**
   * Creates a new VisemeElement instance.
   * 
   * @param type - The type of viseme animation data to generate.
   *               Common values include:
   *               - `redlips_front`: Front-facing lip animation data for standard avatars
   *               - `redlips_back`: Back-facing lip animation data for alternative views
   *               The type determines the format and characteristics of the viseme events
   *               that will be generated during speech synthesis. Different types may
   *               provide different levels of detail or be optimized for specific
   *               animation systems or avatar types.
   * 
   * @example
   * ```typescript
   * // Standard front-facing viseme for avatars
   * const frontViseme = new VisemeElement('redlips_front');
   * 
   * // Back-facing viseme for special camera angles
   * const backViseme = new VisemeElement('redlips_back');
   * 
   * // For use with animation systems
   * const animationViseme = new VisemeElement('redlips_front');
   * // The generated viseme events can be used with:
   * // - Unity 3D avatars
   * // - Unreal Engine characters
   * // - Web-based 3D animations (Three.js, Babylon.js)
   * // - Ready Player Me avatars [[1]](https://github.com/met4citizen/TalkingHead)
   * // - Oculus Lipsync API   * ```
   */
  constructor(type: string) {
    super();
    this.type = type;
  }

  /**
   * Renders the viseme element as an SSML XML string.
   * 
   * Generates the Azure-specific `<mstts:viseme>` element with the type attribute
   * specifying what kind of viseme data should be generated. This is a self-closing
   * element that doesn't contain any content. When processed by the speech synthesizer,
   * it enables the generation of viseme events that can be captured through the
   * Speech SDK for driving facial animations.
   * 
   * @returns The XML string representation of the viseme element in the format:
   *          `<mstts:viseme type="type"/>`
   * 
   * @example
   * ```typescript
   * // Standard front-facing viseme
   * const front = new VisemeElement('redlips_front');
   * console.log(front.render());
   * // Output: <mstts:viseme type="redlips_front"/>
   * 
   * // Back-facing viseme
   * const back = new VisemeElement('redlips_back');
   * console.log(back.render());
   * // Output: <mstts:viseme type="redlips_back"/>
   * 
   * // Custom viseme type (if supported by service)
   * const custom = new VisemeElement('custom_avatar_type');
   * console.log(custom.render());
   * // Output: <mstts:viseme type="custom_avatar_type"/>
   * ```
   * 
   * @override
   */
  render(): string {
    return `<mstts:viseme type="${this.type}"/>`;
  }
}
