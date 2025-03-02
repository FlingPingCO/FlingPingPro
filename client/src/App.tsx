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
      <Route path="/payment-success">
        {() => <PaymentSuccess />}
      </Route>
      <Route path="/payment-cancelled">
        {() => <PaymentCancelled />}
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
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
