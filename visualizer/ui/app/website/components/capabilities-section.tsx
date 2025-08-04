"use client"

import { Code, Zap, Cloud, GitBranch } from "lucide-react"

export default function CapabilitiesSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What can Infra0 do?</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            From simple web apps to complex multi-cloud architectures, Infra0 handles it all
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Side - Features */}
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">View & Analyze Any IaC Code</h3>
                <p className="text-white/70 mb-3">
                  Import existing Terraform, CloudFormation, or Pulumi code. Our AI analyzes 
                  your infrastructure and provides insights via CLI and chat interface.
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-400">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  CLI integration • AI chat analysis • Code insights
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Build & Generate Infrastructure</h3>
                <p className="text-white/70 mb-3">
                  Describe your needs in natural language and watch as AI generates production-ready 
                  infrastructure code with best practices built-in.
                </p>
                <div className="flex items-center gap-2 text-sm text-purple-400">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                  Natural language • Production ready • Best practices
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Multi-Cloud Deployments</h3>
                <p className="text-white/70 mb-3">
                  Deploy across AWS, GCP, Azure, and more with unified configuration. Switch providers 
                  or go multi-cloud without rewriting everything.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  AWS • GCP • Azure • Digital Ocean • 20+ providers
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <GitBranch className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Component Examples Library</h3>
                <p className="text-white/70 mb-3">
                  Pre-built templates and examples for databases, compute instances, containers, 
                  and complex architectures to jumpstart your projects.
                </p>
                <div className="flex items-center gap-2 text-sm text-orange-400">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                  Templates • Examples • Ready to deploy
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Terminal Demo */}
          <div className="relative">
            <div className="bg-gray-900 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-white/60 text-sm font-mono">infra0 chat</span>
              </div>
              <div className="font-mono text-sm space-y-3">
                <div className="text-blue-400">// Natural language input</div>
                <div className="text-white bg-white/5 p-3 rounded border-l-2 border-blue-400">
                  "Create an AWS VPC with public and
                  <br />
                  private subnets, RDS database, and
                  <br />
                  ECS cluster with load balancer"
                </div>
                <div className="space-y-1 pt-2">
                  <div className="flex items-center gap-2 text-green-400">
                    <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                    <span>Generated 47 resources</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                    <span>Applied security best practices</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                    <span>Created infrastructure diagram</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Examples Section */}
        <div className="border-t border-white/10 pt-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-3">Ready-to-Use Examples</h3>
            <p className="text-white/70">Start with proven patterns and architectures</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Database Solutions */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4">
                <div className="w-6 h-6 text-purple-400">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C16.42 3 20 4.79 20 7C20 9.21 16.42 11 12 11C7.58 11 4 9.21 4 7C4 4.79 7.58 3 12 3M4 9V12C4 14.21 7.58 16 12 16C16.42 16 20 14.21 20 12V9C20 11.21 16.42 13 12 13C7.58 13 4 11.21 4 9M4 14V17C4 19.21 7.58 21 12 21C16.42 21 20 19.21 20 17V14C20 16.21 16.42 18 12 18C7.58 18 4 16.21 4 14Z"/>
                  </svg>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Database Solutions</h4>
              <ul className="space-y-2 text-sm text-white/70 mb-4">
                <li>• RDS with Multi-AZ & Read Replicas</li>
                <li>• DynamoDB with Global Tables</li>
                <li>• Cloud SQL with High Availability</li>
                <li>• MongoDB Atlas Clusters</li>
                <li>• PostgreSQL with Backup & Monitoring</li>
                <li>• Redis ElastiCache Clusters</li>
              </ul>
              <button className="text-purple-400 border border-purple-400/30 hover:bg-purple-400/10 px-4 py-2 rounded text-sm">
                View Examples
              </button>
            </div>

            {/* Compute Resources */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4">
                <div className="w-6 h-6 text-blue-400">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4,1H20A1,1 0 0,1 21,2V6A1,1 0 0,1 20,7H4A1,1 0 0,1 3,6V2A1,1 0 0,1 4,1M4,9H20A1,1 0 0,1 21,10V14A1,1 0 0,1 20,15H4A1,1 0 0,1 3,14V10A1,1 0 0,1 4,9M4,17H20A1,1 0 0,1 21,18V22A1,1 0 0,1 20,23H4A1,1 0 0,1 3,22V18A1,1 0 0,1 4,17Z"/>
                  </svg>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Compute Resources</h4>
              <ul className="space-y-2 text-sm text-white/70 mb-4">
                <li>• Auto Scaling EC2 Groups</li>
                <li>• Lambda Functions & APIs</li>
                <li>• Google Compute Engine</li>
                <li>• Azure Virtual Machines</li>
                <li>• Spot Instances & Reserved Capacity</li>
                <li>• Load Balancers & Health Checks</li>
              </ul>
              <button className="text-blue-400 border border-blue-400/30 hover:bg-blue-400/10 px-4 py-2 rounded text-sm">
                View Examples
              </button>
            </div>

            {/* Container Platforms */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-4">
                <div className="w-6 h-6 text-green-400">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.5 2c-.178 0-.356.013-.534.039l-.503.08c-.328.052-.575.344-.575.683v.792c0 .339.247.631.575.683l.503.08c.178.026.356.039.534.039s.356-.013.534-.039l.503-.08c.328-.052.575-.344.575-.683v-.792c0-.339-.247-.631-.575-.683l-.503-.08A5.987 5.987 0 0 0 13.5 2zm-3 0c-.178 0-.356.013-.534.039l-.503.08c-.328.052-.575.344-.575.683v.792c0 .339.247.631.575.683l.503.08c.178.026.356.039.534.039s.356-.013.534-.039l.503-.08c.328-.052.575-.344.575-.683v-.792c0-.339-.247-.631-.575-.683l-.503-.08A5.987 5.987 0 0 0 10.5 2z"/>
                  </svg>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Container Platforms</h4>
              <ul className="space-y-2 text-sm text-white/70 mb-4">
                <li>• ECS with Fargate</li>
                <li>• EKS Kubernetes Clusters</li>
                <li>• GKE with Autopilot</li>
                <li>• Azure Container Instances</li>
                <li>• Docker Swarm Clusters</li>
                <li>• Service Mesh & Ingress</li>
              </ul>
              <button className="text-green-400 border border-green-400/30 hover:bg-green-400/10 px-4 py-2 rounded text-sm">
                View Examples
              </button>
            </div>
          </div>

          {/* CLI Integration */}
          <div className="bg-gray-900/50 rounded-2xl p-8 border border-white/10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">CLI Integration</h3>
                <p className="text-white/70 mb-6">
                  Use Infra0 directly from your terminal. Analyze existing infrastructure, generate new 
                  components, or chat with AI about your architecture.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-white/80 font-mono">infra0 analyze ./terraform</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white/80 font-mono">infra0 generate "web app with database"</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-white/80 font-mono">infra0 chat "optimize my RDS costs"</span>
                  </div>
                </div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 font-mono text-sm">
                <div className="text-green-400 mb-2">$ infra0 analyze ./my-infrastructure</div>
                <div className="text-white/70 space-y-1">
                  <div>📊 Analyzing 23 resources...</div>
                  <div>🔍 Found optimization opportunities</div>
                  <div>💰 Potential cost savings: 34%</div>
                  <div>🛡️ Security recommendations: 3</div>
                  <div className="text-blue-400 mt-2">✨ Chat with AI about these findings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 