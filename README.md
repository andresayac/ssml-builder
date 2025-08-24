# SSML Builder for TypeScript

[![npm version](https://img.shields.io/npm/v/@andresaya/ssml-builder.svg)](https://www.npmjs.com/package/@andresaya/ssml-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Documentation](https://img.shields.io/badge/docs-typedoc-blue.svg)](https://andresayac.github.io/ssml-builder)

A powerful, type-safe TypeScript library for building Speech Synthesis Markup Language (SSML) documents. Create expressive text-to-speech applications with Azure Speech Service and other SSML-compliant engines.

## 🔗 Related Project
Generate voices using SSML documents created with this library:
Check out [edge-tts](https://github.com/andresayac/edge-tts) - A text-to-speech generator that uses the SSML documents built with this library to create natural-sounding voices with Azure Speech Service.

## ✨ Features

- 🎯 **Type-safe API** - Full TypeScript support with comprehensive type definitions
- 🔗 **Fluent Interface** - Chainable methods for intuitive SSML document creation
- 🎙️ **Azure Speech Service Support** - Complete support for Azure-specific SSML extensions
- 📝 **W3C SSML 1.0 Compliant** - Follows the official SSML specification
- 🛡️ **Auto-escaping** - Automatic XML character escaping for security
- 🎨 **Expressive Speech** - Support for emotions, styles, and voice effects
- 📖 **Well-documented** - Extensive JSDoc documentation with examples
- ⚡ **Zero Dependencies** - Lightweight with no external dependencies

## 📦 Installation

```bash
npm install @andresaya/ssml-builder
```

or with yarn:

```bash
yarn add @andresaya/ssml-builder
```

or with pnpm:

```bash
pnpm add @andresaya/ssml-builder
```

## 🚀 Quick Start

```typescript
import { SSMLBuilder } from '@andresaya/ssml-builder';

const ssml = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaNeural')
    .text('Hello world! ')
    .emphasis('This is important', 'strong')
    .break('500ms')
    .text(' Thank you.')
  .build();

console.log(ssml);
// Output: <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" 
//         xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
//           <voice name="en-US-AvaNeural">
//             Hello world! <emphasis level="strong">This is important</emphasis>
//             <break time="500ms"/> Thank you.
//           </voice>
//         </speak>
```

## 📚 Usage Examples

### Basic Text-to-Speech

```typescript
const builder = new SSMLBuilder({ lang: 'en-US' });

const ssml = builder
  .voice('en-US-AvaNeural')
    .text('Welcome to our service.')
  .build();
```

### Multiple Voices (Conversation)

```typescript
const conversation = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaNeural')
    .text('Hello Andrew, how are you?')
  .voice('en-US-AndrewNeural')
    .text('I am doing great, thank you Ava!')
  .build();
```

### Emotional Expression (Azure)

```typescript
const emotional = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaNeural')
    .expressAs('I am so happy to see you!', { 
      style: 'cheerful',
      styledegree: '2'
    })
  .build();
```

### Pronunciation Control

```typescript
const pronunciation = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaNeural')
    .text('The company ')
    .phoneme('Azure', { 
      alphabet: 'ipa', 
      ph: 'æʒər' 
    })
    .text(' provides cloud services.')
  .build();
```

### Prosody Modifications

```typescript
const prosody = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaNeural')
    .prosody('This is spoken slowly and quietly', {
      rate: 'slow',
      volume: 'soft',
      pitch: 'low'
    })
  .build();
```

### Say-As for Formatted Text

```typescript
const formatted = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaNeural')
    .text('The date is ')
    .sayAs('2025-12-31', { 
      interpretAs: 'date',
      format: 'ymd'
    })
    .text(' and the amount is ')
    .sayAs('42.50', { 
      interpretAs: 'currency',
      detail: 'USD'
    })
  .build();
```

### Background Audio

```typescript
const withMusic = new SSMLBuilder({ lang: 'en-US' })
  .backgroundAudio({
    src: 'https://example.com/music.mp3',
    volume: '0.5',
    fadein: '2000ms',
    fadeout: '1000ms'
  })
  .voice('en-US-AvaNeural')
    .text('This speech has background music.')
  .build();
```

### Structured Content

```typescript
const structured = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaNeural')
    .paragraph(p => p
      .sentence(s => s
        .text('First sentence in the paragraph.')
      )
      .sentence(s => s
        .text('Second sentence with ')
        .emphasis('emphasis', 'strong')
        .text('.')
      )
    )
  .build();
```

### Multilingual Support

```typescript
const multilingual = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaMultilingualNeural')
    .text('Hello! ')
    .lang('es-ES', lang => lang
      .text('¡Hola! ')
    )
    .lang('fr-FR', lang => lang
      .text('Bonjour!')
    )
  .build();
```

## 🎯 API Reference

### SSMLBuilder

The main builder class for creating SSML documents.

```typescript
const builder = new SSMLBuilder(options: SSMLOptions);
```

#### Options

- `lang` (required): Language/locale code (e.g., 'en-US', 'es-ES')
- `version` (optional): SSML version (default: '1.0')
- `xmlns` (optional): XML namespace
- `xmlnsMstts` (optional): Microsoft TTS namespace

#### Methods

- `.voice(name: string, effect?: string)` - Add a voice element
- `.backgroundAudio(options: BackgroundAudioOptions)` - Add background audio
- `.voiceConversion(url: string)` - Add voice conversion (Azure preview)
- `.build()` - Generate the final SSML XML string

### VoiceBuilder

Builder for voice elements with various speech modifications.

#### Methods

- `.text(text: string)` - Add plain text
- `.audio(src: string, fallback?: string)` - Add audio file
- `.bookmark(mark: string)` - Add bookmark for tracking
- `.break(options?: BreakOptions | string)` - Add pause
- `.emphasis(text: string, level?: EmphasisLevel)` - Add emphasis
- `.expressAs(text: string, options: ExpressAsOptions)` - Add emotional expression (Azure)
- `.lang(locale: string, callback: Function)` - Switch language
- `.lexicon(uri: string)` - Reference pronunciation lexicon
- `.paragraph(callback: Function)` - Add paragraph
- `.phoneme(text: string, options: PhonemeOptions)` - Specify pronunciation
- `.prosody(text: string, options: ProsodyOptions)` - Modify speech characteristics
- `.sayAs(text: string, options: SayAsOptions)` - Interpret formatted text
- `.sentence(callback: Function)` - Add sentence
- `.silence(options: SilenceOptions)` - Add silence (Azure)
- `.sub(original: string, alias: string)` - Text substitution

## 🛠️ Advanced Features

### Custom Voice Profiles (Azure)

```typescript
const customVoice = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaNeural')
    .ttsEmbedding('custom-profile-id', 'Custom voice text')
  .build();
```

### Viseme Generation (Azure)

```typescript
const withViseme = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaNeural')
    .viseme('redlips_front')
    .text('Text for lip-sync animation')
  .build();
```

### Audio Duration Control (Azure)

```typescript
const timedAudio = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaNeural')
    .audioDuration('10s')
    .text('This will be adjusted to last exactly 10 seconds.')
  .build();
```

## 📖 Documentation

Full API documentation is available at [https://andresayac.github.io/ssml-builder](https://andresayac.github.io/ssml-builder)

Generate documentation locally:

```bash
npm run docs
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## 🏗️ Building

Build the library:

```bash
npm run build
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Azure Speech Service](https://azure.microsoft.com/services/cognitive-services/speech-services/) for comprehensive SSML support
- [W3C SSML Specification](https://www.w3.org/TR/speech-synthesis11/) for the standard
- All contributors who have helped improve this library

## 🔗 Links

- [GitHub Repository](https://github.com/andresayac/ssml-builder)
- [NPM Package](https://www.npmjs.com/package/@andresaya/ssml-builder)
- [Documentation](https://andresayac.github.io/ssml-builder)
- [Issues](https://github.com/andresayac/ssml-builder/issues)

## 📊 Project Status

This library is actively maintained. If you encounter any issues or have feature requests, please open an issue on GitHub.

---

Made with ❤️ by [andresayac](https://github.com/andresayac)