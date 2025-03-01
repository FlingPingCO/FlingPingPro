import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import HowItWorks from "@/pages/HowItWorks";
import Investors from "@/pages/Investors";
import Contact from "@/pages/Contact";
import FAQs from "@/pages/FAQs";
import Legal from "@/pages/Legal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/investors" component={Investors} />
      <Route path="/contact" component={Contact} />
      <Route path="/faqs" component={FAQs} />
      <Route path="/legal" component={Legal} />
      <Route path="/payment-success" component={() => <Home paymentSuccess={true} />} />
      <Route path="/payment-cancelled" component={() => <Home paymentCancelled={true} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
