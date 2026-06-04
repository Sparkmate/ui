import * as React from 'react'
import { Bell, BookOpen, CalendarIcon, Check, ChevronsUpDown, Home, Search, Settings, Sparkles, User } from 'lucide-react'
import { useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AgentChat,
  Alert,
  AlertDescription,
  AlertTitle,
  AppSidebar,
  Avatar,
  AvatarFallback,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Progress,
  RadioGroup,
  RadioGroupItem,
  ReleaseBadge,
  SidebarInset,
  SidebarProvider,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Slider,
  Spinner,
  StatusRow,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  type NavGroup,
} from '../../src'

const demoImageIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Crect x='1' y='1' width='18' height='18' stroke='%23EFFF2F' stroke-width='2'/%3E%3Ccircle cx='10' cy='10' r='4' fill='%23EFFF2F'/%3E%3C/svg%3E"

const demoNavGroups: NavGroup[] = [
  {
    title: 'Home',
    icon: Home,
    path: '/',
    items: [],
  },
  {
    title: 'Docs',
    icon: BookOpen,
    items: [
      { name: 'Getting started', path: '/docs/start' },
      { name: 'Components', path: '/docs/components' },
    ],
  },
  {
    title: 'Image item',
    path: '/image-item',
    imageSrc: demoImageIcon,
    imageAlt: 'Image icon sample',
    items: [],
  },
]

const sectionLinks = [
  { id: 'brand-status', label: 'Brand + Status' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'inputs-fields', label: 'Inputs + Fields' },
  { id: 'choice-controls', label: 'Choice Controls' },
  { id: 'navigation-layout', label: 'Navigation + Layout' },
  { id: 'feedback-content', label: 'Feedback + Content' },
  { id: 'loaders-structure', label: 'Loaders + Structure' },
]

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-xl border border-line bg-panel p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

export function App() {
  const [pathname, setPathname] = useState('/docs/components')
  const [chatMessages, setChatMessages] = useState<
    { id?: string; role: 'user' | 'assistant'; content: string }[]
  >([])

  return (
    <SidebarProvider>
      <AppSidebar
        groups={demoNavGroups}
        pathname={pathname}
        onNavigate={setPathname}
        user={{
          name: 'Sparkmate User',
          email: 'user@sparkmate.com',
        }}
        afterNavMain={
          <nav className="px-2 pb-2 text-xs" aria-label="Design system section links">
            <p className="mb-2 text-muted">Jump to section</p>
            <div className="space-y-1">
              {sectionLinks.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block cursor-pointer rounded-md px-2 py-1 text-muted transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {section.label}
                </a>
              ))}
            </div>
          </nav>
        }
        beforeNavUser={
          <div className="space-y-2 px-2 pb-2">
            <ReleaseBadge label="AI-Core-Agents" version="2.6.0" />
            <div className="space-y-1">
              <StatusRow status="online" label="Web Search" />
              <StatusRow status="disabled" label="Slack MCP" />
              <StatusRow status="error" label="Notion MCP" />
              <StatusRow status="unknown" label="Linear MCP" />
            </div>
          </div>
        }
        onSignOut={() => {
          console.log('sign out')
        }}
      />
      <SidebarInset className="p-6 md:p-8">
        <main className="mx-auto grid h-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <header className="rounded-xl border border-line bg-panel p-6">
              <span className="serial text-spark">Sparkmate UI Playground</span>
              <h1 className="mt-2 text-3xl font-semibold">Design System Showcase</h1>
              <p className="mt-2 text-sm text-muted">
                Keep sidebar navigation, jump links, component matrix, and live chat in one page.
              </p>
            </header>

            <Section
              id="brand-status"
              title="Brand and Status"
              description="Badges, release metadata, and system statuses."
            >
        <div className="flex flex-wrap items-center gap-2">
          <Badge>default</Badge>
          <Badge variant="secondary">secondary</Badge>
          <Badge variant="destructive">destructive</Badge>
          <Badge variant="outline">outline</Badge>
          <Badge variant="ghost">ghost</Badge>
          <Badge variant="link">link</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ReleaseBadge label="AI-Core-Agents" version="2.6.0" />
          <StatusRow status="online" label="Web Search" />
          <StatusRow status="disabled" label="Slack MCP" />
          <StatusRow status="error" label="Notion MCP" />
          <StatusRow status="unknown" label="Linear MCP" />
        </div>
            </Section>

            <Section id="buttons" title="Buttons" description="Button variants, sizes, groups, and toggles.">
        <div className="flex flex-wrap gap-2">
          <Button>default</Button>
          <Button variant="secondary">secondary</Button>
          <Button variant="outline">outline</Button>
          <Button variant="ghost">ghost</Button>
          <Button variant="link">link</Button>
          <Button variant="destructive">destructive</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="xs">xs</Button>
          <Button size="sm">sm</Button>
          <Button size="default">default</Button>
          <Button size="lg">lg</Button>
          <Button size="icon" aria-label="settings">
            <Settings className="size-4" />
          </Button>
          <Button size="icon-xs" aria-label="bell">
            <Bell className="size-4" />
          </Button>
          <Button size="icon-sm" aria-label="search">
            <Search className="size-4" />
          </Button>
          <Button size="icon-lg" aria-label="user">
            <User className="size-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <ButtonGroup>
            <Button variant="outline">Left</Button>
            <Button variant="outline">Center</Button>
            <Button variant="outline">Right</Button>
          </ButtonGroup>
          <ButtonGroup orientation="vertical">
            <Button variant="secondary">Top</Button>
            <Button variant="secondary">Middle</Button>
            <Button variant="secondary">Bottom</Button>
          </ButtonGroup>
          <ButtonGroup>
            <ButtonGroupText>Group Text</ButtonGroupText>
            <ButtonGroupSeparator />
            <Button variant="ghost">Action</Button>
          </ButtonGroup>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Toggle>Default</Toggle>
          <Toggle variant="outline">Outline</Toggle>
          <Toggle size="sm">Small</Toggle>
          <Toggle size="lg">Large</Toggle>
        </div>
        <ToggleGroup type="single" defaultValue="left">
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="center">Center</ToggleGroupItem>
          <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
            </Section>

            <Section
              id="inputs-fields"
              title="Inputs and Field Patterns"
              description="Text controls, grouped input patterns, and field wrappers."
            >
        <div className="grid gap-3 md:grid-cols-2">
          <Input placeholder="Basic input" />
          <Textarea placeholder="Textarea content" />
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search docs..." />
            <InputGroupAddon align="inline-end">
              <InputGroupButton>
                <ChevronsUpDown className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupAddon align="block-start">
              <InputGroupText>Project description</InputGroupText>
            </InputGroupAddon>
            <Textarea placeholder="Long block variant in InputGroup" />
          </InputGroup>
        </div>
        <FieldSet>
          <FieldLegend>Field variants</FieldLegend>
          <FieldGroup>
            <Field orientation="vertical">
              <FieldLabel htmlFor="field-vertical">Vertical field</FieldLabel>
              <FieldContent>
                <Input id="field-vertical" placeholder="Vertical layout" />
                <FieldDescription>Default orientation.</FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="field-horizontal">Horizontal field</FieldLabel>
              <FieldContent>
                <Input id="field-horizontal" placeholder="Horizontal layout" />
                <FieldDescription>Label + control in row.</FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="responsive">
              <FieldLabel htmlFor="field-responsive">Responsive field</FieldLabel>
              <FieldContent>
                <Input id="field-responsive" placeholder="Responsive layout" />
                <FieldDescription>Column on small screens, row on larger screens.</FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
            </Section>

            <Section
              id="choice-controls"
              title="Choice Controls"
              description="Checkbox, radios, switches, select, sliders, and progress."
            >
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Boolean controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox defaultChecked /> Checkbox
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch defaultChecked /> Switch
              </label>
              <RadioGroup defaultValue="weekly" className="gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="daily" /> Daily
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="weekly" /> Weekly
                </label>
              </RadioGroup>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Select, slider, progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select defaultValue="gpt-5">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-5">GPT-5</SelectItem>
                  <SelectItem value="claude-opus">Claude Opus</SelectItem>
                  <SelectItem value="gemini-2.5">Gemini 2.5</SelectItem>
                </SelectContent>
              </Select>
              <Slider defaultValue={[35]} max={100} step={1} />
              <Progress value={62} />
            </CardContent>
          </Card>
        </div>
            </Section>

            <Section
              id="navigation-layout"
              title="Navigation and Layout"
              description="Navigation primitives and layout helpers."
            >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Design System</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="a11y">A11y</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="rounded-md border border-line p-3 text-sm">
            Default tabs list variant.
          </TabsContent>
          <TabsContent value="tokens" className="rounded-md border border-line p-3 text-sm">
            Token specs and scales.
          </TabsContent>
          <TabsContent value="a11y" className="rounded-md border border-line p-3 text-sm">
            Keyboard and contrast checks.
          </TabsContent>
        </Tabs>

        <Tabs defaultValue="api">
          <TabsList variant="line">
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>
          <TabsContent value="api" className="rounded-md border border-line p-3 text-sm">
            Line tabs variant.
          </TabsContent>
          <TabsContent value="examples" className="rounded-md border border-line p-3 text-sm">
            Usage examples.
          </TabsContent>
        </Tabs>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" size="default" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive size="icon">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="icon">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" size="default" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
            </Section>

            <Section
              id="feedback-content"
              title="Feedback and Content Blocks"
              description="Alerts, cards, item rows, and expanders."
            >
        <div className="grid gap-3 md:grid-cols-2">
          <Alert>
            <Sparkles className="size-4" />
            <AlertTitle>Default alert</AlertTitle>
            <AlertDescription>Informational messaging with muted tone.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <Bell className="size-4" />
            <AlertTitle>Destructive alert</AlertTitle>
            <AlertDescription>High-priority error state.</AlertDescription>
          </Alert>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Card</CardTitle>
            <CardDescription>Base card structure.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted">Body content slot.</CardContent>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>

        <ItemGroup className="rounded-md border border-line">
          <Item variant="default">
            <ItemMedia variant="icon">
              <CalendarIcon className="size-4" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Default item</ItemTitle>
              <ItemDescription>Regular row with icon media.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">
                Open
              </Button>
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item variant="outline" size="sm">
            <ItemMedia variant="default">
              <Avatar className="size-8">
                <AvatarFallback>KM</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Outline item / sm size</ItemTitle>
              <ItemDescription>Smaller density variant.</ItemDescription>
            </ItemContent>
          </Item>
          <ItemSeparator />
          <Item variant="muted">
            <ItemMedia variant="default">
              <Check className="size-4 text-green-500" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Muted item</ItemTitle>
              <ItemDescription>Muted surface variant.</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

        <Accordion type="single" collapsible className="rounded-md border border-line px-4">
          <AccordionItem value="token-scale">
            <AccordionTrigger>Accordion trigger</AccordionTrigger>
            <AccordionContent>Accordion content area.</AccordionContent>
          </AccordionItem>
        </Accordion>
            </Section>

            <Section
              id="loaders-structure"
              title="Loaders and Structure"
              description="Skeletons, spinners, and separators."
            >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>UI</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Spinner />
          </div>
          <Separator />
          <p className="text-sm text-muted">Separator component shown above.</p>
        </div>
            </Section>
          </div>

          <aside className="sticky top-8 h-[min(760px,calc(100vh-4rem))] min-h-[520px]">
            <AgentChat
              messages={chatMessages}
              onMessagesChange={setChatMessages}
              assistantName="Kim"
              assistantAvatarSrc="/Kim.png"
              modelLabel="GPT-5.1"
              emptyTitle="Kim. Ready."
              emptyDescription="Ask anything about production, team communications, or factory telemetry."
              placeholder="Enter query..."
              onSubmit={async (text) => ({
                role: 'assistant',
                content: `Demo response from @spkm/ui chat for: "${text}"`,
              })}
            />
          </aside>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
