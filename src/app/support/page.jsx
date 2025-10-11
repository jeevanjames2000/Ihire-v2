"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordian";

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="text-center py-12 sm:py-16 px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">Support & Help Center</h1>
        <p className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto text-gray-700">
          We’re here to help you with any questions about your iHire Job Portal experience.
        </p>
      </section>

      {/* Contact Form Section */}
      <section className="flex justify-center px-4 pb-12">
        <Card className="w-full max-w-lg bg-white text-gray-900 shadow-xl rounded-2xl border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-900 font-semibold">
              Contact Our Support Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4">
              <Input placeholder="Your Name" className="bg-gray-100" />
              <Input type="email" placeholder="Your Email" className="bg-gray-100" />
              <Textarea placeholder="Describe your issue..." className="bg-gray-100 min-h-[120px]" />
              <Button className="bg-[#48adb9] hover:bg-[#2a6b73] transition-colors text-white font-semibold">
                Submit Ticket
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="faq-1" className="bg-white border border-gray-200 rounded-xl px-4 shadow-sm">
            <AccordionTrigger className="text-gray-900 text-lg font-medium">
              How do I reset my password?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Go to the login page and click “Forgot Password”. You’ll receive a reset link in your registered email.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-2" className="bg-white border border-gray-200 rounded-xl px-4 shadow-sm">
            <AccordionTrigger className="text-gray-900 text-lg font-medium">
              How can employers post a new job?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Employers can log in to their dashboard and click “Post a Job”. Fill in job details and publish instantly.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-3" className="bg-white border border-gray-200 rounded-xl px-4 shadow-sm">
            <AccordionTrigger className="text-gray-900 text-lg font-medium">
              Can I update my resume after uploading?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Yes! Simply go to your profile section, click “Upload Resume”, and choose the new file to replace the old one.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-4" className="bg-white border border-gray-200 rounded-xl px-4 shadow-sm">
            <AccordionTrigger className="text-gray-900 text-lg font-medium">
              How do I contact customer support directly?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              You can reach us anytime at <span className="text-orange-500">support@ihire.com</span> or call us at
              <span className="text-orange-500"> +1 (800) 555-2424</span>.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Footer Note */}
      <div className="text-center pb-8 text-gray-500 text-sm">
        © 2025 iHire Job Portal Inc. All rights reserved.
      </div>
    </div>
  );
};

export default SupportPage;
