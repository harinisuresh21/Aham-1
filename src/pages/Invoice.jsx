import React, { useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Container from '../components/layout/Container';
import {
  Printer,
  Download,
  ArrowLeft,
  Mail,
  Check,
  Copy,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  Truck,
  X,
  Send,
  Sparkles
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Default / fallback sample invoice data
const defaultInvoiceData = {
  invoiceNumber: 'INV-2026-8942',
  invoiceDate: 'Aug 16, 2026',
  dueDate: 'Paid on Aug 15, 2026',
  orderId: 'AHM-10023',
  orderDate: 'Aug 15, 2026',
  status: 'PAID',
  paymentMethod: 'Google Pay / UPI',
  paymentRef: 'UPI/42891028471/AHAM',
  placeOfSupply: '29 - Karnataka',
  reverseCharge: 'No',

  company: {
    name: 'AHAM Natural Wellness Pvt. Ltd.',
    tagline: 'Holistic Harmony • Ancient Wisdom',
    address: 'No. 14, 2nd Floor, Heritage Craft House, 100ft Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    country: 'India',
    gstin: '29AABCA9876C1Z4',
    pan: 'AABCA9876C',
    cin: 'U24233KA2024PTC189201',
    fssai: '11224333000492',
    ayushLic: 'AYUSH-KA-2024-0081',
    email: 'billing@aham.in',
    phone: '+91 80 4567 8900',
    website: 'www.aham.in'
  },

  customer: {
    name: 'Priya Sundaram',
    email: 'priya.sundaram@example.com',
    phone: '+91 98765 43210',
    billingAddress: 'No. 42, 3rd Cross, 100ft Road, Indiranagar',
    shippingAddress: 'No. 42, 3rd Cross, 100ft Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    country: 'India',
    stateCode: '29'
  },

  shipping: {
    courier: 'Blue Dart Express',
    awbNumber: 'BLUEDART-849204128IN',
    deliveryType: 'Standard Eco-Packaging',
    dispatchDate: 'Aug 16, 2026',
    fee: 0
  },

  items: [
    {
      id: 'item-1',
      name: 'Aham Natural Turmeric Powder',
      subtitle: 'Single-Origin High-Curcumin Lakadong',
      sku: 'AHM-TURM-250G',
      hsn: '30049011',
      weight: '250g',
      quantity: 1,
      unitPrice: 356.25,
      gstRate: 12,
      discount: 0,
      total: 399
    },
    {
      id: 'item-2',
      name: 'Cold-Pressed Sesame Oil (Mara Chekku)',
      subtitle: 'Raw Wood-Pressed Artisanal Extraction',
      sku: 'AHM-SES-500ML',
      hsn: '15155091',
      weight: '500ml',
      quantity: 1,
      unitPrice: 428.57,
      gstRate: 5,
      discount: 0,
      total: 450
    }
  ],

  financials: {
    subtotal: 784.82,
    cgst: 32.09,
    sgst: 32.09,
    igst: 0,
    shippingFee: 0,
    discountTotal: 0,
    grandTotal: 849.00,
    amountInWords: 'Eight Hundred and Forty-Nine Indian Rupees Only'
  }
};

const Invoice = ({ order: propOrder }) => {
  const { id } = useParams();
  const location = useLocation();
  const toast = useToast();
  const invoiceRef = useRef(null);

  const activeOrder = propOrder || location.state?.order;
  const orderId = id || activeOrder?.orderId || defaultInvoiceData.orderId;

  // Seamlessly merge live order details when provided
  const invoiceData = {
    ...defaultInvoiceData,
    orderId,
    orderDate: activeOrder?.date || defaultInvoiceData.orderDate,
    customer: {
      ...defaultInvoiceData.customer,
      name: activeOrder?.recipientName || defaultInvoiceData.customer.name,
      email: activeOrder?.recipientEmail || defaultInvoiceData.customer.email,
      phone: activeOrder?.recipientPhone || defaultInvoiceData.customer.phone,
      shippingAddress: activeOrder?.deliveryAddress || defaultInvoiceData.customer.shippingAddress,
      billingAddress: activeOrder?.deliveryAddress || defaultInvoiceData.customer.billingAddress,
    },
    financials: {
      ...defaultInvoiceData.financials,
    },
  };

  // Accurately compute Grand Total: Subtotal (₹784.82) + CGST (₹32.09) + SGST (₹32.09) = ₹849.00
  const subtotal = Number(invoiceData.financials.subtotal || 784.82);
  const cgst = Number(invoiceData.financials.cgst || 32.09);
  const sgst = Number(invoiceData.financials.sgst || 32.09);
  const igst = Number(invoiceData.financials.igst || 0);
  const shippingFee = Number(invoiceData.financials.shippingFee || 0);
  const discountTotal = Number(invoiceData.financials.discountTotal || 0);
  const computedGrandTotal = Number((subtotal + cgst + sgst + igst + shippingFee - discountTotal).toFixed(2));

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState(invoiceData.customer.email);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [copiedInvoiceNo, setCopiedInvoiceNo] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    toast.success(
      'Preparing PDF invoice for download. Select "Save as PDF" in the destination prompt.',
      'Exporting PDF'
    );
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleCopyInvoiceNumber = () => {
    navigator.clipboard.writeText(invoiceData.invoiceNumber);
    setCopiedInvoiceNo(true);
    toast.success(`Copied ${invoiceData.invoiceNumber} to clipboard!`, 'Copied');
    setTimeout(() => setCopiedInvoiceNo(false), 2000);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!emailAddress || !emailAddress.includes('@')) {
      toast.error('Please provide a valid email address.', 'Invalid Email');
      return;
    }

    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      setIsEmailModalOpen(false);
      toast.success(
        `Official tax invoice #${invoiceData.invoiceNumber} has been dispatched to ${emailAddress}.`,
        'Invoice Sent'
      );
    }, 1200);
  };

  return (
    <div className="bg-[#F6F4EE] min-h-screen py-6 sm:py-10 text-[#2A2A2A] selection:bg-[#C2A573]/20">
      
      {/* ========================================================================= */}
      {/* 1. TOP STICKY ACTION BAR (Hidden in print) */}
      {/* ========================================================================= */}
      <div className="sticky top-0 z-30 mb-6 bg-white/95 backdrop-blur-md border-b border-[#E8E3D7] shadow-xs print:hidden">
        <Container>
          <div className="py-3.5 flex flex-wrap items-center justify-between gap-4">
            
            {/* Left: Back Link & Breadcrumb */}
            <div className="flex items-center gap-3">
              <Link
                to="/orders"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2C422F] hover:bg-[#F9F7F1] border border-[#E8E3D7] transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back to Orders</span>
              </Link>
              <span className="hidden sm:inline-block text-xs text-[#6B6B6B]">|</span>
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <span className="font-serif font-semibold text-[#2C422F]">Tax Invoice</span>
                <span className="font-mono text-[#6B6B6B]">#{invoiceData.invoiceNumber}</span>
              </div>
            </div>

            {/* Right: Actions (Download PDF, Print, Share/Email) */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopyInvoiceNumber}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white text-[#2C422F] border border-[#E8E3D7] hover:bg-[#F9F7F1] transition-all cursor-pointer"
                title="Copy Invoice Number"
              >
                {copiedInvoiceNo ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copiedInvoiceNo ? 'Copied' : 'Copy No.'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white text-[#2C422F] border border-[#E8E3D7] hover:bg-[#F9F7F1] hover:border-[#2C422F]/40 transition-all shadow-2xs cursor-pointer"
              >
                <Mail size={14} className="text-[#C2A573]" />
                <span className="hidden sm:inline">Email Invoice</span>
                <span className="sm:hidden">Email</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white text-[#2C422F] border border-[#E8E3D7] hover:bg-[#F9F7F1] hover:border-[#2C422F]/40 transition-all shadow-2xs cursor-pointer"
              >
                <Printer size={14} className="text-[#2C422F]" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2C422F] text-white hover:bg-[#355039] hover:shadow-md transition-all shadow-xs cursor-pointer"
              >
                <Download size={14} className="text-[#C2A573]" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* ========================================================================= */}
      {/* 2. INVOICE PAPER SHEET CONTAINER */}
      {/* ========================================================================= */}
      <Container>
        <div className="max-w-4xl mx-auto">
          
          <div
            ref={invoiceRef}
            id="aham-tax-invoice"
            className="bg-white border border-[#E8E3D7] shadow-xl rounded-2xl sm:rounded-3xl p-6 sm:p-12 transition-all duration-300 print:shadow-none print:border-none print:p-0 print:m-0 print:rounded-none"
          >
            {/* Top Accent Strip */}
            <div className="h-1.5 bg-gradient-to-r from-[#2C422F] via-[#C2A573] to-[#2C422F] rounded-t-xl mb-8 print:hidden" />

            {/* Header: Company Details & Invoice Meta */}
            <div className="pb-8 border-b border-[#E8E3D7]">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                
                {/* Brand Identity */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#2C422F] text-[#F9F7F1] flex items-center justify-center shadow-xs">
                      <Leaf size={22} className="text-[#C2A573]" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C422F] tracking-tight">
                        AHAM
                      </h1>
                      <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8B5E3C]">
                        {invoiceData.company.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-[#6B6B6B] space-y-0.5 leading-relaxed max-w-sm">
                    <p className="font-semibold text-[#2A2A2A]">{invoiceData.company.name}</p>
                    <p>{invoiceData.company.address}</p>
                    <p>{invoiceData.company.city}, {invoiceData.company.state} - {invoiceData.company.postalCode}</p>
                    <p className="pt-1">
                      <strong className="text-[#2A2A2A]">GSTIN:</strong> {invoiceData.company.gstin} | <strong className="text-[#2A2A2A]">PAN:</strong> {invoiceData.company.pan}
                    </p>
                    <p>
                      <strong className="text-[#2A2A2A]">CIN:</strong> {invoiceData.company.cin}
                    </p>
                    <p className="text-[11px]">
                      Ayush Lic: {invoiceData.company.ayushLic} • FSSAI: {invoiceData.company.fssai}
                    </p>
                  </div>
                </div>

                {/* Invoice Meta Card */}
                <div className="sm:text-right space-y-3 bg-[#FDFAF5] p-5 rounded-2xl border border-[#E8E3D7] sm:min-w-[280px]">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2C422F]/10 text-[#2C422F] text-[11px] font-bold uppercase tracking-wider">
                    <Sparkles size={12} className="text-[#C2A573]" />
                    <span>Tax Invoice / Bill of Supply</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-[#6B6B6B]">Invoice Number</p>
                    <p className="text-lg font-mono font-bold text-[#2C422F]">
                      {invoiceData.invoiceNumber}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-left sm:text-right pt-2 border-t border-[#E8E3D7]">
                    <div>
                      <span className="text-[#6B6B6B] block">Invoice Date:</span>
                      <strong className="text-[#2A2A2A]">{invoiceData.invoiceDate}</strong>
                    </div>
                    <div>
                      <span className="text-[#6B6B6B] block">Order Ref:</span>
                      <strong className="text-[#2A2A2A]">#{orderId}</strong>
                    </div>
                    <div>
                      <span className="text-[#6B6B6B] block">Payment:</span>
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <CheckCircle2 size={12} /> {invoiceData.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6B6B6B] block">State Code:</span>
                      <strong className="text-[#2A2A2A]">{invoiceData.customer.stateCode}</strong>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ========================================================================= */}
            {/* 3. BILLED TO & SHIPPED TO 2-COLUMN SECTION */}
            {/* ========================================================================= */}
            <div className="py-6 border-b border-[#E8E3D7] grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Billed To */}
              <div className="p-4 rounded-xl bg-[#FDFAF5]/60 border border-[#E8E3D7]/70 space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#6B6B6B] block mb-1">
                  Billed To (Customer Details)
                </span>
                <p className="font-serif font-bold text-base text-[#2C422F]">
                  {invoiceData.customer.name}
                </p>
                <p className="text-xs text-[#2A2A2A] leading-relaxed">
                  {invoiceData.customer.billingAddress}
                </p>
                <p className="text-xs text-[#2A2A2A]">
                  {invoiceData.customer.city}, {invoiceData.customer.state} - {invoiceData.customer.postalCode}
                </p>
                <div className="pt-2 text-xs text-[#6B6B6B] space-y-0.5">
                  <p><strong className="text-[#2A2A2A]">Phone:</strong> {invoiceData.customer.phone}</p>
                  <p><strong className="text-[#2A2A2A]">Email:</strong> {invoiceData.customer.email}</p>
                  <p><strong className="text-[#2A2A2A]">Place of Supply:</strong> {invoiceData.placeOfSupply}</p>
                </div>
              </div>

              {/* Shipped To */}
              <div className="p-4 rounded-xl bg-[#FDFAF5]/60 border border-[#E8E3D7]/70 space-y-1.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#6B6B6B]">
                    Shipped To (Delivery Address)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#2C422F] bg-white px-2 py-0.5 rounded border border-[#E8E3D7]">
                    <Truck size={10} /> {invoiceData.shipping.courier}
                  </span>
                </div>
                <p className="font-serif font-bold text-base text-[#2C422F]">
                  {invoiceData.customer.name}
                </p>
                <p className="text-xs text-[#2A2A2A] leading-relaxed">
                  {invoiceData.customer.shippingAddress}
                </p>
                <p className="text-xs text-[#2A2A2A]">
                  {invoiceData.customer.city}, {invoiceData.customer.state} - {invoiceData.customer.postalCode}
                </p>
                <div className="pt-2 text-xs text-[#6B6B6B] space-y-0.5">
                  <p><strong className="text-[#2A2A2A]">Tracking AWB:</strong> {invoiceData.shipping.awbNumber}</p>
                  <p><strong className="text-[#2A2A2A]">Delivery Mode:</strong> {invoiceData.shipping.deliveryType}</p>
                  <p><strong className="text-[#2A2A2A]">Dispatch Date:</strong> {invoiceData.shipping.dispatchDate}</p>
                </div>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* 4. ITEMIZED PRODUCTS TABLE */}
            {/* ========================================================================= */}
            <div className="py-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#2C422F] text-[11px] uppercase tracking-wider text-[#2C422F] font-bold">
                      <th className="py-3 px-2 w-10 text-center">#</th>
                      <th className="py-3 px-3">Item & Ayurvedic Formulation</th>
                      <th className="py-3 px-2 text-center">HSN</th>
                      <th className="py-3 px-2 text-center">Qty</th>
                      <th className="py-3 px-3 text-right">Unit Price</th>
                      <th className="py-3 px-2 text-center">GST %</th>
                      <th className="py-3 px-3 text-right">Net Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E3D7] text-xs">
                    {invoiceData.items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-[#FDFAF5]/40 transition-colors">
                        <td className="py-3.5 px-2 text-center text-[#6B6B6B] font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-3">
                          <p className="font-semibold text-sm text-[#2A2A2A]">{item.name}</p>
                          <p className="text-[11px] text-[#6B6B6B]">{item.subtitle} • {item.weight}</p>
                          <span className="text-[10px] font-mono text-[#8B5E3C] bg-[#F9F7F1] px-1.5 py-0.5 rounded border border-[#E8E3D7] mt-1 inline-block">
                            SKU: {item.sku}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-center font-mono text-[#6B6B6B]">
                          {item.hsn}
                        </td>
                        <td className="py-3.5 px-2 text-center font-bold text-[#2A2A2A]">
                          {item.quantity}
                        </td>
                        <td className="py-3.5 px-3 text-right text-[#2A2A2A]">
                          ₹{item.unitPrice.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-2 text-center font-medium text-[#2C422F]">
                          {item.gstRate}%
                        </td>
                        <td className="py-3.5 px-3 text-right font-semibold text-[#2C422F]">
                          ₹{item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 5. FINANCIAL LEDGER BREAKDOWN & PAYMENT SUMMARY */}
            {/* ========================================================================= */}
            <div className="pt-4 pb-8 border-t border-[#E8E3D7]">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Left: Payment Method, Words & Verification (7 cols) */}
                <div className="md:col-span-7 space-y-4">
                  <div className="p-4 rounded-xl bg-[#FDFAF5] border border-[#E8E3D7] text-xs space-y-2">
                    <p className="font-bold text-[#2C422F] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-[#C2A573]" />
                      Payment Verification & Settlement
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[#6B6B6B]">
                      <div>
                        <span>Mode:</span> <strong className="text-[#2A2A2A]">{invoiceData.paymentMethod}</strong>
                      </div>
                      <div>
                        <span>Status:</span> <strong className="text-emerald-700">Fully Settled</strong>
                      </div>
                      <div className="col-span-2 truncate">
                        <span>Transaction Ref:</span> <code className="font-mono text-[#2A2A2A] ml-1">{invoiceData.paymentRef}</code>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-[#6B6B6B] leading-relaxed">
                    <span className="font-bold text-[#2A2A2A] block mb-0.5">Amount Chargeable (in words):</span>
                    <p className="italic font-serif text-sm text-[#2C422F]">
                      {invoiceData.financials.amountInWords}
                    </p>
                  </div>

                  {/* Ayurvedic Guarantee Seal Pill */}
                  <div className="flex items-center gap-3 pt-2 text-[11px] text-[#6B6B6B]">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-medium">
                      <Leaf size={12} /> 100% Certified Organic Herbs
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F9F7F1] text-[#2C422F] border border-[#E8E3D7] font-medium">
                      Eco-Glass Packaging
                    </span>
                  </div>
                </div>

                {/* Right: Subtotal & Tax Calculation Ledger (5 cols) */}
                <div className="md:col-span-5 bg-[#FDFAF5] p-5 rounded-2xl border border-[#E8E3D7] space-y-2.5 text-xs">
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Subtotal (Taxable Value)</span>
                    <span className="font-medium text-[#2A2A2A]">₹{invoiceData.financials.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Central GST (CGST)</span>
                    <span className="font-medium text-[#2A2A2A]">₹{invoiceData.financials.cgst.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>State GST (SGST)</span>
                    <span className="font-medium text-[#2A2A2A]">₹{invoiceData.financials.sgst.toFixed(2)}</span>
                  </div>

                  {invoiceData.financials.discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Promotional Discount</span>
                      <span>-₹{invoiceData.financials.discountTotal.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Standard Shipping</span>
                    <span className="font-bold text-emerald-700">FREE</span>
                  </div>

                  {/* Grand Total Line */}
                  <div className="border-t-2 border-[#2C422F] pt-3 mt-2 flex justify-between items-baseline">
                    <span className="font-serif text-base font-bold text-[#2C422F]">
                      Grand Total (INR)
                    </span>
                    <span className="text-2xl font-bold font-serif text-[#2C422F]">
                      ₹{computedGrandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* ========================================================================= */}
            {/* 6. TERMS, COMPLIANCE & AUTHORIZED SIGNATORY */}
            {/* ========================================================================= */}
            <div className="pt-6 border-t border-[#E8E3D7] text-[11px] text-[#6B6B6B] leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-end">
                
                {/* Terms */}
                <div className="sm:col-span-8 space-y-1.5">
                  <p className="font-bold text-[#2A2A2A] uppercase tracking-wider text-[10px]">
                    Terms & Conditions of Sale:
                  </p>
                  <ol className="list-decimal list-inside space-y-0.5 text-[#6B6B6B]/90">
                    <li>All Ayurvedic herbs and formulations are guaranteed authentic, organic, and ethically sourced.</li>
                    <li>Goods once unsealed cannot be returned due to hygiene and Ayush regulatory guidelines.</li>
                    <li>Disputes, if any, shall be subject to the exclusive jurisdiction of courts in Bengaluru, India.</li>
                    <li>This is a system-generated electronic tax invoice and does not require a physical signature under the Information Technology Act.</li>
                  </ol>
                </div>

                {/* Signatory Stamp Box */}
                <div className="sm:col-span-4 text-center sm:text-right space-y-1">
                  <div className="h-14 flex items-end justify-center sm:justify-end">
                    <span className="font-serif italic text-[#8B5E3C] text-sm tracking-wide font-medium">
                      Aham Natural Wellness
                    </span>
                  </div>
                  <div className="border-t border-[#2C422F]/40 pt-1">
                    <p className="font-bold text-[#2C422F]">Authorized Signatory</p>
                    <p className="text-[10px] text-[#6B6B6B]">AHAM Natural Wellness Pvt. Ltd.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom helper info (Print-hidden) */}
          <div className="mt-6 text-center text-xs text-[#6B6B6B] print:hidden">
            <p>
              Need assistance regarding this tax document or GST invoice modification? Contact our concierge at{' '}
              <a href="mailto:billing@aham.in" className="text-[#2C422F] font-semibold underline">
                billing@aham.in
              </a>{' '}
              or call <strong className="text-[#2A2A2A]">+91 80 4567 8900</strong>.
            </p>
          </div>

        </div>
      </Container>

      {/* ========================================================================= */}
      {/* 7. SHARE / EMAIL INVOICE MODAL */}
      {/* ========================================================================= */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 print:hidden">
          <div className="bg-white border border-[#E8E3D7] rounded-2xl sm:rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3D7]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2C422F] text-white flex items-center justify-center">
                  <Mail size={16} className="text-[#C2A573]" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#2C422F]">
                  Email Tax Invoice
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F9F7F1] flex items-center justify-center text-[#6B6B6B] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              We'll send an official PDF copy of invoice <strong className="text-[#2A2A2A]">#{invoiceData.invoiceNumber}</strong> with full GST tax breakdown.
            </p>

            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2A2A2A] mb-1.5">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  required
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E3D7] text-sm text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#2C422F] transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6B6B6B] hover:text-[#2A2A2A] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#2C422F] text-white hover:bg-[#355039] disabled:opacity-60 cursor-pointer shadow-sm"
                >
                  {isSendingEmail ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} className="text-[#C2A573]" />
                      <span>Send Invoice</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. PRINT MEDIA STYLESHEET */}
      {/* ========================================================================= */}
      <style>{`
        @media print {
          @page {
            margin: 10mm;
            size: A4;
          }
          body {
            -webkit-print-color-adjust: exact;
            background: #ffffff !important;
            color: #000000 !important;
          }
          /* Hide browser headers/footers, navigation, action bar, modals, overlays, and toasts */
          nav, 
          header, 
          footer, 
          .print\\:hidden, 
          #toast-container, 
          [aria-live="polite"], 
          .toast, 
          .animate-toast {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
          #aham-tax-invoice {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>

    </div>
  );
};

export default Invoice;
