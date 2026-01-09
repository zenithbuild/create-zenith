# create-zenith

![Zenith Framework Banner](https://raw.githubusercontent.com/zenithbuild/create-zenith/main/assets/banner.png)

**The fastest way to create a new Zenith application.**

Create-zenith is the official scaffolding tool for [Zenith Framework](https://github.com/zenithbuild/zenith) - a modern, reactive web framework with built-in state management, lifecycle hooks, and zero-config development.

---

## 🚀 Quick Start

Get started with Zenith in seconds using your preferred package manager:

### Using Bun (Recommended)
```bash
bun create zenith my-app
```

### Using npm
```bash
npm create zenith my-app
```

### Using npx
```bash
npx create-zenith my-app
```

### Using pnpm
```bash
pnpm create zenith my-app
```

![Quick Start Demo](https://raw.githubusercontent.com/zenithbuild/create-zenith/main/assets/quick-start.png)

---

## 📦 What You Get

After running the create command, you'll have a fully-configured Zenith project with:

✅ **Reactive State Management** - Built-in `state`, `signal`, and `effect` primitives  
✅ **Lifecycle Hooks** - `zenOnMount` and `zenOnUnmount` for component lifecycle  
✅ **File-Based Routing** - Automatic routing from your `app/pages/` directory  
✅ **Component System** - Reusable components with scoped styles  
✅ **Hot Module Reload** - Instant updates during development  
✅ **Zero Config** - Works immediately after scaffolding  

---

## 🎯 Next Steps

Once your project is created:

```bash
# Navigate to your project
cd my-app

# Start the development server
bun run dev

# Open http://localhost:3000 in your browser
```

Your app is now running with full reactivity! Try clicking the counter button to see state management in action.

---

## 📁 Project Structure

```
my-app/
├── src/
│   ├── pages/           # Your routes (index.zen = /)
│   ├── layouts/         # Layout components
│   └── components/      # Reusable components
├── package.json
└── bun.lock
```

---

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server with HMR |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |

---

## 💡 Example: Your First Component

The scaffolded `app/pages/index.zen` includes a working counter example:

```html
<script>
    state count = 0
    
    function increment() {
        count = count + 1
    }
</script>

<main>
    <h1>Welcome to Zenith</h1>
    <p>Count: {count}</p>
    <button onclick="increment">Increment</button>
</main>

<style>
    main {
        max-width: 800px;
        margin: 2rem auto;
        padding: 2rem;
    }
</style>
```

**Key Features:**
- `state count = 0` - Reactive state variable
- `{count}` - Automatic DOM updates when state changes
- `onclick="increment"` - Event handler wiring
- Component-scoped `<style>` blocks

---

## 🔧 Requirements

- **Bun** 1.0+ (recommended) or **Node.js** 18+
- Modern browser with ES6+ support

---

## 📚 Learn More

- [Zenith Documentation](https://github.com/zenithbuild/zenith)
- [Zenith CLI](https://github.com/zenithbuild/zenith-cli)
- [Examples & Tutorials](https://github.com/zenithbuild/zenith/tree/main/examples)

---

## 🤝 Contributing

Found a bug or have a feature request? [Open an issue](https://github.com/zenithbuild/create-zenith/issues) or submit a pull request!

---

## 📄 License

MIT © Zenith Team

---

## 🛠️ Local Development

If you are developing `create-zenith` locally, use the following commands to test your changes without needing to publish to npm:

### Run from Source
```bash
# Uses the local src/index.ts directly
npm run create my-test-app
```

### Spin up a Template
```bash
# Scaffolds a project into the examples/ directory
npm run example
```

### Link Globally
To use your local version with `bun create zenith` anywhere on your machine:
```bash
bun link
```

---

**Made with ⚡ by the Zenith Team**
