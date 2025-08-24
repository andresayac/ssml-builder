import { SSMLElement } from '../core/SSMLElement';

/**
 * SSML element for voice conversion/transformation (Azure-specific, Preview).
 * 
 * The `<mstts:voiceconversion>` element enables voice conversion, which transforms the characteristics
 * of the synthesized voice using a pre-trained voice conversion model. This Azure Speech Service specific
 * feature (currently in preview) allows you to modify voice output to match different voice characteristics
 * while maintaining the original text and language. The element references a voice conversion model via URL
 * that contains the transformation parameters.
 * 
 * Voice conversion is useful for creating consistent voice experiences across different speakers,
 * adapting voices for specific scenarios, or creating unique voice personalities. The conversion
 * applies to all voices in the SSML document and must be placed as a direct child of the speak element,
 * before any voice elements.
 * 
 * @example
 * ```typescript
 * // Basic voice conversion
 * const conversion = new VoiceConversionElement('https://example.com/voice-model.json');
 * conversion.render();
 * // Output: <mstts:voiceconversion url="https://example.com/voice-model.json"/>
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voiceConversion('https://example.com/custom-voice-transform.json')
 *   .voice('en-US-AvaNeural')
 *     .text('This voice will be transformed using the conversion model.')
 *   .build();
 * ```
 * 
 * @remarks
 * - This is an Azure Speech Service specific extension requiring the mstts namespace
 * - The feature is currently in preview and may change in future releases
 * - The voiceconversion element is self-closing and cannot contain text or other elements [[11]]
 * - Must be a direct child of the speak element, placed before voice elements [[11]]
 * - Only one voice conversion element is allowed per SSML document
 * - The URL must point to a valid voice conversion model accessible by the service
 * - The conversion affects all voices in the document
 * - Voice conversion models must be created and trained separately
 * 
 * @experimental This feature is in preview and subject to change
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/voice-conversion} Voice Conversion Documentation
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup} Azure SSML Documentation [[11]]
 */
export class VoiceConversionElement extends SSMLElement {
  /**
   * The URL of the voice conversion model.
   * @private
   */
  private url: string;

  /**
   * Creates a new VoiceConversionElement instance.
   * 
   * @param url - The URL of the voice conversion model.
   *              Must be a publicly accessible HTTPS URL pointing to a valid voice conversion model file.
   *              The model contains the transformation parameters that will be applied to the voice output.
   *              The URL should point to a model that has been:
   *              - Pre-trained using Azure's voice conversion service
   *              - Hosted in a location accessible by the Speech service
   *              - Compatible with the current version of the voice conversion API
   *              Common formats include JSON configuration files or binary model files.
   * 
   * @example
   * ```typescript
   * // Standard voice conversion model
   * const standard = new VoiceConversionElement(
   *   'https://models.example.com/voice-transform-v1.json'
   * );
   * 
   * // Custom trained model
   * const custom = new VoiceConversionElement(
   *   'https://company.com/models/brand-voice-conversion.json'
   * );
   * 
   * // Regional model
   * const regional = new VoiceConversionElement(
   *   'https://cdn.example.com/models/uk-accent-transform.json'
   * );
   * 
   * // Character voice transformation
   * const character = new VoiceConversionElement(
   *   'https://game-assets.com/voices/character-transform.json'
   * );
   * 
   * // Age transformation model
   * const ageTransform = new VoiceConversionElement(
   *   'https://models.example.com/young-to-elderly-voice.json'
   * );
   * ```
   */
  constructor(url: string) {
    super();
    this.url = url;
  }

  /**
   * Renders the voice conversion element as an SSML XML string.
   * 
   * Generates the Azure-specific `<mstts:voiceconversion>` element with the url attribute
   * pointing to the voice conversion model. This is a self-closing element that doesn't
   * contain any content or child elements. The element instructs the speech synthesizer
   * to apply voice conversion transformation to all voices in the document using the
   * specified model.
   * 
   * @returns The XML string representation of the voice conversion element in the format:
   *          `<mstts:voiceconversion url="url"/>`
   * 
   * @example
   * ```typescript
   * // Simple model URL
   * const simple = new VoiceConversionElement(
   *   'https://example.com/model.json'
   * );
   * console.log(simple.render());
   * // Output: <mstts:voiceconversion url="https://example.com/model.json"/>
   * 
   * // Complex URL with path
   * const complex = new VoiceConversionElement(
   *   'https://cdn.example.com/models/v2/transform-config.json'
   * );
   * console.log(complex.render());
   * // Output: <mstts:voiceconversion url="https://cdn.example.com/models/v2/transform-config.json"/>
   * 
   * // With query parameters
   * const withParams = new VoiceConversionElement(
   *   'https://api.example.com/voice-model?version=2&type=standard'
   * );
   * console.log(withParams.render());
   * // Output: <mstts:voiceconversion url="https://api.example.com/voice-model?version=2&type=standard"/>
   * ```
   * 
   * @override
   */
  render(): string {
    return `<mstts:voiceconversion url="${this.url}"/>`;
  }
}
