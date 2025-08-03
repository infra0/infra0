# 🚀 Infra0

**AI-Powered Infrastructure as Code Generator**

Generate production-ready infrastructure code from natural language descriptions with interactive visual diagrams.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

🤖 **AI-Powered Generation** - Describe your infrastructure in plain English and get production-ready IaC code

📊 **Interactive Diagrams** - Visualize your infrastructure with interactive flow diagrams powered by React Flow

💬 **Conversational Interface** - Iterate on your infrastructure through a chat-based interface

🎯 **Structured Schema** - Custom Infra0 schema that maps infrastructure resources to visual components

🔄 **Real-time Streaming** - Watch your infrastructure being built step-by-step with streaming workflows

🐳 **Docker Ready** - Containerized deployment for easy setup and scaling

---

## 🏗️ Architecture

Infra0 consists of three main components:

```
infra0/
├── cli/                 # Command-line interface
├── visualizer/
│   ├── server/         # Node.js backend with AI integration
│   └── ui/            # Next.js frontend with interactive diagrams
└── scripts/           # Docker and deployment scripts
```

### Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, React Flow
- **Backend**: Node.js, Express, MongoDB, TypeScript
- **AI**: Anthropic Claude (via AI SDK) and Gemini Google (via AI SDK)
- **CLI**: Commander.js, TypeScript
- **Infrastructure**: Pulumi (TypeScript)
- **Containerization**: Docker

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Docker (optional, for containerized deployment)
- MongoDB instance
- Anthropic or Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/infra0.git
   cd infra0
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create `.env.development` files in the respective directories:

   **visualizer/server/.env**

   ```env
   # Database
   NODE_ENV=development
   ```

   **visualizer/server/.env.development**

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/infra0

   # AI Configuration
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   or
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

   # JWT
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=7d

   # Server
   PORT=4000
   ```

**visualizer/ui/.env.local**

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**cli/.env.development**

```env
# Docker Image Configuration
INFRA0_UI_IMAGE_URL=infra0/visualizer-ui:latest
INFRA0_UI_IMAGE_PLATFORM=linux/amd64
INFRA0_UI_HOST_PORT=3000
INFRA0_UI_CONTAINER_PORT=3000
```

4. **Start the development environment**

   ```bash
   # Start both frontend and backend
   pnpm dev:visualizer

   # Or start everything including CLI
   pnpm dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

---

## 📖 Usage

### Web Interface

1. **Start a New Project**

   - Open the web interface at http://localhost:3000
   - Click "New Project" or describe your infrastructure needs

2. **Describe Your Infrastructure**

   ```
   Create an AWS VPC with public and private subnets,
   an RDS PostgreSQL database, and an ECS cluster
   with a load balancer
   ```

3. **View Generated Code**
   - Get production-ready Pulumi TypeScript code
   - Interact with the visual diagram
   - Configure individual components

### CLI Interface

1. **Initialize a new project**

   ```bash
   cd cli
   pnpm dev init -p project_path
   ```

2. **Render the visualizer**
   ```bash
   pnpm dev render
   ```

### Example Infrastructure Generation

**Input:**

```
I need a serverless API with a Lambda function, API Gateway,
DynamoDB table, and proper IAM roles for a user management system
```

**Output:**

- Complete Pulumi TypeScript code
- Interactive infrastructure diagram
- Configurable component properties
- Deployment-ready structure

---

## 🔧 Development

### Project Structure

```
infra0/
├── cli/
│   ├── src/
│   │   ├── actions/        # CLI actions (init, render)
│   │   ├── commands/       # Command definitions
│   │   └── main.ts         # CLI entry point
│   └── package.json
├── visualizer/
│   ├── server/
│   │   ├── src/
│   │   │   ├── controller/ # API controllers
│   │   │   ├── llm/        # AI integration
│   │   │   ├── model/      # MongoDB models
│   │   │   ├── services/   # Business logic
│   │   │   └── types/      # TypeScript definitions
│   │   └── package.json
│   └── ui/
│       ├── app/            # Next.js app router
│       ├── components/     # React components
│       ├── types/          # Frontend types
│       └── package.json
└── package.json            # Root workspace config
```

### Available Scripts

```bash
# Development
pnpm dev                     # Start all services
pnpm dev:visualizer         # Start frontend and backend only

# Building
pnpm build                  # Build all packages
pnpm server:inject-ui-build # Build UI and inject into server

# Docker
pnpm ui:docker-build        # Build Docker image
pnpm ui:docker-run          # Run Docker container
```

### API Endpoints

- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/:id` - Get conversation
- `POST /api/conversations/:id/messages` - Add message
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

---

## 🧠 How It Works

### AI Integration

Infra0 have support to both Anthropic's Claude and Google's Gemini to:

1. **Parse Natural Language** - Understand infrastructure requirements from user descriptions
2. **Generate Pulumi Code** - Create production-ready TypeScript code
3. **Create Schema** - Generate structured Infra0 schema for visualization
4. **Optimize Architecture** - Suggest best practices and optimizations

### Schema Format

The Infra0 schema maps infrastructure resources to visual components:

```typescript
interface Infra0 {
  resources: Record<string, Infra0Resource>;
  diagram: {
    nodes: Infra0Node[];
    edges: Infra0Edge[];
  };
}

interface Infra0Resource {
  type: string; // Pulumi type (e.g., "aws:ec2:Vpc")
  config: Record<string, any>; // Constructor arguments
  dependsOn?: string[]; // Dependencies
}

interface Infra0Node {
  id: string; // Matches resource key
  label: string; // Display name
  parent?: string; // For nesting
  group?: string; // For styling
}
```

---

## 🐳 Docker Deployment

### Build and Run

```bash
# Build the Docker image
pnpm ui:docker-build

# Run the container
pnpm ui:docker-run
```

### Manual Docker Commands

```bash
# Build
docker build -t infra0/visualizer-ui ./visualizer/ui

# Run
docker run -p 3000:3000 infra0/visualizer-ui
```

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add JSDoc comments for public APIs
- Write tests for new features
- Update documentation as needed
- Follow the existing code style

### Areas for Contribution

- 🚀 **New Cloud Providers** - Add support for Azure, GCP
- 🎨 **UI/UX Improvements** - Enhanced diagram interactions
- 🤖 **AI Enhancements** - Better prompt engineering
- 📚 **Documentation** - Tutorials and examples
- 🧪 **Testing** - Unit and integration tests
- 🔧 **DevOps** - CI/CD improvements

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📬 Support

- 🐛 **Bug Reports**: [Create an issue](https://github.com/your-org/infra0/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/your-org/infra0/discussions)

---

## 🗺️ Roadmap

- [ ] **Multi-cloud Support** - Azure and GCP integration
- [ ] **Advanced Diagrams** - 3D visualization and animations
- [ ] **Team Collaboration** - Real-time collaborative editing
- [ ] **Infrastructure Testing** - Automated validation and testing
- [ ] **Cost Optimization** - AI-powered cost analysis
- [ ] **Security Scanning** - Built-in security best practices
- [ ] **Version Control** - Git integration for infrastructure changes

---

<div align="center">
  <p>Made with ❤️ by Developers, for Developers</p>
  <p><em>Empowering infrastructure teams to build faster and smarter</em></p>
  <p>
    <a href="#top">Back to top</a>
  </p>
</div>
