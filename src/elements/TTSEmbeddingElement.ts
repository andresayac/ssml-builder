import { SSMLElement } from '../core/SSMLElement';

/**
 * SSML element for using custom speaker profiles in text-to-speech (Azure-specific).
 * 
 * The `<mstts:ttsembedding>` element enables the use of custom speaker profiles for speech synthesis.
 * This Azure Speech Service specific feature allows you to create personalized voices by training
 * a custom speaker model and then using that model to synthesize speech. The element references
 * a pre-trained speaker profile ID that contains the voice characteristics to be applied to the text.
 * 
 * This feature is particularly useful for creating consistent brand voices, personalizing virtual
 * assistants, or maintaining voice consistency across different applications. The speaker profile
 * must be created and trained using Azure's Custom Neural Voice service before it can be referenced
 * in SSML documents.
 * 
 * @example
 * ```typescript
 * // Basic usage with speaker profile
 * const embedding = new TTSEmbeddingElement(
 *   'profile-12345-abcd',
 *   'This text will be spoken with the custom voice.'
 * );
 * embedding.render();
 * // Output: <mstts:ttsembedding speakerProfileId="profile-12345-abcd">This text will be spoken with the custom voice.</mstts:ttsembedding>
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .ttsEmbedding('custom-speaker-001', 'Welcome to our service!')
 *     .text(' How can I help you today?')
 *   .build();
 * ```
 * 
 * @remarks
 * - This is an Azure Speech Service specific extension requiring the mstts namespace
 * - The speaker profile must be pre-trained using Azure Custom Neural Voice service
 * - The speakerProfileId must be a valid identifier for an existing speaker profile in your Azure account
 * - The element can contain text and the following elements: audio, break, emphasis, lang, phoneme, prosody, say-as, and sub [[11]]
 * - Special XML characters in text are automatically escaped
 * - Custom speaker profiles provide more natural and personalized voice synthesis
 * - This feature may require specific Azure subscription tiers or permissions
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/custom-neural-voice} Custom Neural Voice Documentation
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup} Azure SSML Documentation
 */
export class TTSEmbeddingElement extends SSMLElement {
  /**
   * The identifier of the custom speaker profile.
   * @private
   */
  private speakerProfileId: string;
  
  /**
   * The text content to be spoken with the custom voice.
   * @private
   */
  private text: string;

  /**
   * Creates a new TTSEmbeddingElement instance.
   * 
   * @param speakerProfileId - The unique identifier of the custom speaker profile.
   *                           This ID is generated when you create and train a custom
   *                           speaker profile using Azure's Custom Neural Voice service.
   *                           The profile contains the voice characteristics and training
   *                           data that define how the text should be spoken.
   *                           Format typically: alphanumeric string with hyphens
   *                           (e.g., "profile-12345-abcd-efgh")
   * 
   * @param text - The text content to be synthesized using the custom speaker profile.
   *               Special XML characters (&, <, >, ", ') are automatically escaped
   *               to ensure valid XML output and prevent injection attacks.
   *               The text will be spoken with the voice characteristics defined
   *               in the referenced speaker profile.
   * 
   * @example
   * ```typescript
   * // Corporate brand voice
   * const brandVoice = new TTSEmbeddingElement(
   *   'company-brand-voice-001',
   *   'Welcome to our company. We value your business.'
   * );
   * 
   * // Personal assistant voice
   * const assistant = new TTSEmbeddingElement(
   *   'personal-assistant-profile',
   *   'Good morning! Here is your schedule for today.'
   * );
   * 
   * // Character voice for gaming/entertainment
   * const characterVoice = new TTSEmbeddingElement(
   *   'game-character-wizard',
   *   'Greetings, brave adventurer! Your quest awaits.'
   * );
   * 
   * // Narrator voice for audiobooks
   * const narrator = new TTSEmbeddingElement(
   *   'audiobook-narrator-001',
   *   'Chapter 1: The Beginning of an Adventure'
   * );
   * 
   * // Custom voice for accessibility
   * const accessibilityVoice = new TTSEmbeddingElement(
   *   'user-preferred-voice',
   *   'Your document has been saved successfully.'
   * );
   * ```
   */
  constructor(speakerProfileId: string, text: string) {
    super();
    this.speakerProfileId = speakerProfileId;
    this.text = text;
  }

  /**
   * Renders the TTS embedding element as an SSML XML string.
   * 
   * Generates the Azure-specific `<mstts:ttsembedding>` element with the speakerProfileId
   * attribute referencing the custom speaker profile. The text content is automatically
   * escaped to prevent XML injection and ensure valid output. The rendered element instructs
   * the speech synthesizer to use the specified custom voice profile for the enclosed text.
   * 
   * @returns The XML string representation of the TTS embedding element in the format:
   *          `<mstts:ttsembedding speakerProfileId="id">text</mstts:ttsembedding>`
   * 
   * @example
   * ```typescript
   * // Simple text
   * const simple = new TTSEmbeddingElement('profile-001', 'Hello world');
   * console.log(simple.render());
   * // Output: <mstts:ttsembedding speakerProfileId="profile-001">Hello world</mstts:ttsembedding>
   * 
   * // With special characters (automatically escaped)
   * const special = new TTSEmbeddingElement(
   *   'profile-002',
   *   'Terms & "conditions" apply'
   * );
   * console.log(special.render());
   * // Output: <mstts:ttsembedding speakerProfileId="profile-002">Terms &amp; &quot;conditions&quot; apply</mstts:ttsembedding>
   * 
   * // Long profile ID
   * const longId = new TTSEmbeddingElement(
   *   'enterprise-voice-profile-abc123-def456-ghi789',
   *   'Corporate announcement'
   * );
   * console.log(longId.render());
   * // Output: <mstts:ttsembedding speakerProfileId="enterprise-voice-profile-abc123-def456-ghi789">Corporate announcement</mstts:ttsembedding>
   * 
   * // Multi-line text
   * const multiline = new TTSEmbeddingElement(
   *   'narrator-voice',
   *   'First line.\nSecond line.'
   * );
   * console.log(multiline.render());
   * // Output: <mstts:ttsembedding speakerProfileId="narrator-voice">First line.\nSecond line.</mstts:ttsembedding>
   * ```
   * 
   * @override
   */
  render(): string {
    return `<mstts:ttsembedding speakerProfileId="${this.speakerProfileId}">${this.escapeXml(this.text)}</mstts:ttsembedding>`;
  }
}
