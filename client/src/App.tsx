import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import HowItWorks from "@/pages/HowItWorks";
import Investors from "@/pages/Investors";
import Contact from "@/pages/Contact";
import FAQs from "@/pages/FAQs";
import Legal from "@/pages/Legal";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import BlogAdmin from "@/pages/BlogAdmin";
import AdminLogin from "@/pages/AdminLogin";
import Illustrations from "@/pages/Illustrations";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCancelled from "@/pages/PaymentCancelled";

function Router() {
  return (
    <Switch>
      <Route path="/">
        {() => <Home />}
      </Route>
      <Route path="/about">
        {() => <About />}
      </Route>
      <Route path="/how-it-works">
        {() => <HowItWorks />}
      </Route>
      <Route path="/investors">
        {() => <Investors />}
      </Route>
      <Route path="/contact">
        {() => <Contact />}
      </Route>
      <Route path="/faqs">
        {() => <FAQs />}
      </Route>
      <Route path="/legal">
        {() => <Legal />}
      </Route>
      <Route path="/blog">
        {() => <Blog />}
      </Route>
      <Route path="/blog/:id">
        {() => <BlogPost />}
      </Route>
      <Route path="/illustrations">
        {() => <Illustrations />}
      </Route>
      <Route path="/payment-success">
        {() => <PaymentSuccess />}
      </Route>
      <Route path="/payment-cancelled">
        {() => <PaymentCancelled />}
      </Route>
      <Route path="/admin/login">
        {() => <AdminLogin />}
      </Route>
      <Route path="/admin/blog">
        {() => <BlogAdmin />}
      </Route>
      <Route>
        {() => <NotFound />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScrollToTop />
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
