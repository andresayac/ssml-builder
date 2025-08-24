import { SSMLElement } from '../core/SSMLElement';
import { type ExpressAsOptions } from '../types';

/**
 * SSML element for applying emotional expression and speaking styles (Azure-specific).
 * 
 * The `<mstts:express-as>` element enables neural voices to express emotions and speaking styles
 * beyond the default neutral voice. This Azure Speech Service specific feature allows for more
 * natural and engaging speech synthesis by simulating various emotional states, professional
 * styles, and character roles. The element significantly enhances the expressiveness of
 * synthesized speech for scenarios like audiobooks, virtual assistants, and interactive applications.
 * 
 * Not all neural voices support all styles, and the quality of expression varies by voice and language.
 * The express-as element can only be used with neural voices that support style features.
 * 
 * @example
 * ```typescript
 * // Basic emotional expression
 * const happy = new ExpressAsElement('I am so happy!', { style: 'cheerful' });
 * happy.render();
 * // Output: <mstts:express-as style="cheerful">I am so happy!</mstts:express-as>
 * 
 * // With intensity control
 * const excited = new ExpressAsElement('Amazing news!', {
 *   style: 'excited',
 *   styledegree: '2'
 * });
 * 
 * // With role-playing
 * const childVoice = new ExpressAsElement('Once upon a time...', {
 *   style: 'narration-relaxed',
 *   role: 'Girl'
 * });
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .expressAs('Welcome to customer service!', { 
 *       style: 'customerservice' 
 *     })
 *   .build();
 * ```
 * 
 * @remarks
 * - This is an Azure Speech Service specific extension requiring the mstts namespace
 * - Not all neural voices support all styles - check voice documentation for compatibility
 * - The express-as element can contain text and other inline elements
 * - Style expression affects the entire enclosed content
 * - Special XML characters in text are automatically escaped
 * - Can be nested within voice, paragraph, and sentence elements
 * - Cannot be nested within another express-as element
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#express-as-element} Express-As Element Documentation
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#voice-styles-and-roles} Voice Styles and Roles Support
 */
export class ExpressAsElement extends SSMLElement {
  /**
   * The text content to be expressed with the specified style.
   * @private
   */
  private text: string;
  
  /**
   * Configuration options for the expression.
   * @private
   */
  private options: ExpressAsOptions;

  /**
   * Creates a new ExpressAsElement instance.
   * 
   * @param text - The text content to express with the specified style.
   *               This text will be spoken with the emotional or stylistic expression.
   *               Special XML characters (&, <, >, ", ') are automatically escaped
   *               to ensure valid XML output and prevent injection attacks.
   * 
   * @param options - Configuration object for the expression style
   * @param options.style - The emotional or speaking style to apply (required).
   *                        Common styles include:
   *                        - Emotions: 'cheerful', 'sad', 'angry', 'excited', 'friendly', 'terrified'
   *                        - Professional: 'newscast', 'customerservice', 'narration-professional'
   *                        - Special: 'whispering', 'shouting', 'poetry-reading'
   *                        See ExpressAsStyle type for full list
   * @param options.styledegree - Optional intensity of the style expression.
   *                              Range: "0.01" (minimal) to "2" (double intensity).
   *                              Default is "1" (normal intensity).
   *                              Higher values make the expression more pronounced.
   * @param options.role - Optional age and gender role to simulate different speakers.
   *                       Available roles: 'Girl', 'Boy', 'YoungAdultFemale', 
   *                       'YoungAdultMale', 'OlderAdultFemale', 'OlderAdultMale',
   *                       'SeniorFemale', 'SeniorMale'
   * 
   * @example
   * ```typescript
   * // Simple emotional expression
   * const cheerful = new ExpressAsElement(
   *   'What a beautiful day!',
   *   { style: 'cheerful' }
   * );
   * 
   * // With adjusted intensity
   * const veryExcited = new ExpressAsElement(
   *   'This is incredible!',
   *   { style: 'excited', styledegree: '1.5' }
   * );
   * 
   * // Professional styles
   * const newsReader = new ExpressAsElement(
   *   'Breaking news just in...',
   *   { style: 'newscast-formal' }
   * );
   * 
   * // Customer service tone
   * const support = new ExpressAsElement(
   *   'How may I help you today?',
   *   { style: 'customerservice' }
   * );
   * 
   * // With role for character voices
   * const childNarrator = new ExpressAsElement(
   *   'And they lived happily ever after!',
   *   { style: 'narration-relaxed', role: 'Girl' }
   * );
   * 
   * // Special effects
   * const whisper = new ExpressAsElement(
   *   'This is a secret',
   *   { style: 'whispering' }
   * );
   * ```
   */
  constructor(text: string, options: ExpressAsOptions) {
    super();
    this.text = text;
    this.options = options;
  }

  /**
   * Renders the express-as element as an SSML XML string.
   * 
   * Generates the Azure-specific `<mstts:express-as>` element with the required style
   * attribute and optional styledegree and role attributes. Text content is automatically
   * escaped to prevent XML injection and ensure valid output. Only includes optional
   * attributes if their values are defined, keeping the XML clean.
   * 
   * @returns The XML string representation of the express-as element in the format:
   *          `<mstts:express-as style="value" [styledegree="value"] [role="value"]>text</mstts:express-as>`
   * 
   * @example
   * ```typescript
   * // Basic style only
   * const expr1 = new ExpressAsElement('Hello!', { style: 'cheerful' });
   * console.log(expr1.render());
   * // Output: <mstts:express-as style="cheerful">Hello!</mstts:express-as>
   * 
   * // With style degree
   * const expr2 = new ExpressAsElement('Wow!', {
   *   style: 'excited',
   *   styledegree: '2'
   * });
   * console.log(expr2.render());
   * // Output: <mstts:express-as style="excited" styledegree="2">Wow!</mstts:express-as>
   * 
   * // With role
   * const expr3 = new ExpressAsElement('Story time', {
   *   style: 'narration-relaxed',
   *   role: 'OlderAdultMale'
   * });
   * console.log(expr3.render());
   * // Output: <mstts:express-as style="narration-relaxed" role="OlderAdultMale">Story time</mstts:express-as>
   * 
   * // All attributes with escaped text
   * const expr4 = new ExpressAsElement('Terms & "Conditions"', {
   *   style: 'serious',
   *   styledegree: '1.2',
   *   role: 'YoungAdultFemale'
   * });
   * console.log(expr4.render());
   * // Output: <mstts:express-as style="serious" styledegree="1.2" role="YoungAdultFemale">Terms &amp; &quot;Conditions&quot;</mstts:express-as>
   * ```
   * 
   * @override
   */
  render(): string {
    const attrs: string[] = [`style="${this.options.style}"`];
    
    if (this.options.styledegree) {
      attrs.push(`styledegree="${this.options.styledegree}"`);
    }
    if (this.options.role) {
      attrs.push(`role="${this.options.role}"`);
    }
    
    return `<mstts:express-as ${attrs.join(' ')}>${this.escapeXml(this.text)}</mstts:express-as>`;
  }
}
