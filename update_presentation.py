import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

INPUT_PPT = '/Users/sunil/Ecommerce-Frontend/ppt_download/ps36.pptx'
OUTPUT_PPT = '/Users/sunil/Ecommerce-Frontend/ppt_download/MetraVerify_Winning_SIH_Presentation.pptx'

prs = pptx.Presentation(INPUT_PPT)
slide_width = prs.slide_width
slide_height = prs.slide_height

print(f"Presentation loaded. Dimensions: {slide_width} x {slide_height}, Slides: {len(prs.slides)}")

# 1. Update Slide 1 (Title Page)
slide1 = prs.slides[0]
for shape in slide1.shapes:
    if shape.name == "TextBox 9" and shape.has_text_frame:
        tf = shape.text_frame
        tf.clear()
        
        bullets = [
            ("Problem Statement ID –", " SIH 2026 (PS-1736)"),
            ("Problem Statement Title –", " MetraVerify: Digital Verification & Certification System for Weighing and Measuring Instruments (Legal Metrology)"),
            ("Theme –", " Smart Automation / Public Governance & Legal Metrology"),
            ("PS Category –", " Software"),
            ("Team ID –", " SIH2026-CHEETAH"),
            ("Team Name –", " CHEETAH"),
        ]
        
        for i, (label, val) in enumerate(bullets):
            p = tf.add_paragraph() if i > 0 else tf.paragraphs[0]
            p.space_after = Pt(12)
            
            run_bullet = p.add_run()
            run_bullet.text = "• "
            run_bullet.font.bold = True
            run_bullet.font.size = Pt(15)
            run_bullet.font.color.rgb = RGBColor(217, 119, 6) # Amber
            
            run_label = p.add_run()
            run_label.text = label
            run_label.font.bold = True
            run_label.font.size = Pt(15)
            run_label.font.color.rgb = RGBColor(15, 23, 42) # Slate-900
            
            run_val = p.add_run()
            run_val.text = val
            run_val.font.bold = (label.startswith("Team Name") or label.startswith("Problem Statement ID"))
            run_val.font.size = Pt(15)
            if label.startswith("Team Name"):
                run_val.font.color.rgb = RGBColor(217, 119, 6) # Amber
            else:
                run_val.font.color.rgb = RGBColor(30, 58, 138) # Navy-blue

# 2. Update Slide 2 (Vision & Central Authority matching)
slide2 = prs.slides[1]
for shape in slide2.shapes:
    if shape.name == "Text 26" and shape.has_text_frame:
        shape.text_frame.text = "• One national digital trust layer for Legal Metrology enforcement."
        shape.text_frame.paragraphs[0].font.size = Pt(11)
    elif shape.name == "Text 27" and shape.has_text_frame:
        shape.text_frame.text = "• Central Authority Triage: Admin dispatches to local inspectors."
        shape.text_frame.paragraphs[0].font.size = Pt(11)
    elif shape.name == "Text 28" and shape.has_text_frame:
        shape.text_frame.text = "• Automated local inspector matching by applicant district & pincode."
        shape.text_frame.paragraphs[0].font.size = Pt(11)
    elif shape.name == "Text 29" and shape.has_text_frame:
        shape.text_frame.text = "• Fair markets, honest business, empowered 1.4B consumers."
        shape.text_frame.paragraphs[0].font.size = Pt(11)
    elif shape.name == "Text 31" and shape.has_text_frame:
        shape.text_frame.text = "• From manual paper stamps to real-time tamper-evident QR verification."
        shape.text_frame.paragraphs[0].font.size = Pt(11)

# 3. Update Slide 3 (Technical Approach, MERN Stack, 7-point check, RBAC)
slide3 = prs.slides[2]
for shape in slide3.shapes:
    # Update System Principles
    if shape.name == "Text 12" and shape.has_text_frame:
        shape.text_frame.text = "• Central Authority triage & inspection allocation."
    elif shape.name == "Text 13" and shape.has_text_frame:
        shape.text_frame.text = "• 7-Point Statutory Digital Inspection Engine (visual, zero, corner, calib, seal, env)."
    elif shape.name == "Text 15" and shape.has_text_frame:
        shape.text_frame.text = "• Role-Based Access Control (RBAC) across 4 Portals: Business, Admin, LMO, GATC."
    elif shape.name == "Text 16" and shape.has_text_frame:
        shape.text_frame.text = "• Immutable Digital Audit Trails & Timestamps for tamper-evident logging."
    elif shape.name == "Text 17" and shape.has_text_frame:
        shape.text_frame.text = "• Tamper-Evident QR Verification with clean URL payloads (zero PII leakage)."
    elif shape.name == "Text 19" and shape.has_text_frame:
        shape.text_frame.text = "• Live National Stamping & Verification Throughput analytics."
    elif shape.name == "Text 20" and shape.has_text_frame:
        shape.text_frame.text = "Tech Stack: MERN Prototype (Live) + Scaled Architecture"
        shape.text_frame.paragraphs[0].font.bold = True
        shape.text_frame.paragraphs[0].font.size = Pt(10)
    elif shape.name == "Text 36" and shape.has_text_frame:
        shape.text_frame.text = "INSPECTOR WORKSTATION"
    elif shape.name == "Text 37" and shape.has_text_frame:
        shape.text_frame.text = "• Responsive portal (Web SPA)"
    elif shape.name == "Text 38" and shape.has_text_frame:
        shape.text_frame.text = "• Pincode/district matched cases"
    elif shape.name == "Text 39" and shape.has_text_frame:
        shape.text_frame.text = "• 7-Point statutory verification"
    elif shape.name == "Text 40" and shape.has_text_frame:
        shape.text_frame.text = "• Today/Week/Month/Year KPIs"
    elif shape.name == "Text 50" and shape.has_text_frame:
        shape.text_frame.text = "• Immutable audit log entries"
    elif shape.name == "Text 53" and shape.has_text_frame:
        shape.text_frame.text = "• Generates PDF certificate"
    elif shape.name == "Text 54" and shape.has_text_frame:
        shape.text_frame.text = "• Embeds cryptographic QR"
    elif shape.name == "Text 55" and shape.has_text_frame:
        shape.text_frame.text = "• Digital stamp code assigned"

# 4. Update Slide 4 (Delete waste management quote & enhance stakeholder metrics)
slide4 = prs.slides[3]
for shape in slide4.shapes:
    if shape.name == "Text 48" and shape.has_text_frame:
        # REPLACE THE COPY-PASTE WASTE MANAGEMENT ERROR!
        tf = shape.text_frame
        tf.clear()
        p = tf.paragraphs[0]
        p.text = '"India\'s First Unified Digital Trust Infrastructure for Legal Metrology — Empowering Consumers, Honest Traders & Enforcement Authorities."'
        p.font.italic = True
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = RGBColor(30, 58, 138) # Navy Blue
        p.alignment = PP_ALIGN.CENTER
    elif shape.name == "Text 19" and shape.has_text_frame:
        shape.text_frame.text = "• Central triage & officer allocation"
    elif shape.name == "Text 21" and shape.has_text_frame:
        shape.text_frame.text = "• Stamping throughput intelligence"
    elif shape.name == "Text 23" and shape.has_text_frame:
        shape.text_frame.text = "• Auto-location & pincode matching"
    elif shape.name == "Text 25" and shape.has_text_frame:
        shape.text_frame.text = "• GSTIN/PAN & compliance tracking"
    elif shape.name == "Text 28" and shape.has_text_frame:
        shape.text_frame.text = "• Instant QR scan verification"
    elif shape.name == "Text 30" and shape.has_text_frame:
        shape.text_frame.text = "• View validity, class & serial specs"
    elif shape.name == "Text 32" and shape.has_text_frame:
        shape.text_frame.text = "• 7-Point digital inspection flow"
    elif shape.name == "Text 33" and shape.has_text_frame:
        shape.text_frame.text = "• Today/Week/Month/Year metrics"
    elif shape.name == "Text 35" and shape.has_text_frame:
        shape.text_frame.text = "• Standardized test lab queues"
    elif shape.name == "Text 36" and shape.has_text_frame:
        shape.text_frame.text = "• Digital calibration certificates"

# 5. Update Slide 6 (Research and References)
slide6 = prs.slides[5]
for shape in slide6.shapes:
    if shape.name == "Oval 8" and shape.has_text_frame:
        shape.text_frame.text = "CHEETAH"
        shape.text_frame.paragraphs[0].font.bold = True
        shape.text_frame.paragraphs[0].font.size = Pt(14)
        shape.text_frame.paragraphs[0].font.color.rgb = RGBColor(255, 255, 255)
    elif shape.name == "TextBox 8" and shape.has_text_frame:
        tf = shape.text_frame
        tf.clear()
        refs = [
            ("1. Legal Metrology Act, 2009 & General Rules, 2011", "Statutory framework governing verification, inspection checklists, and mandatory stamping periods under the Department of Consumer Affairs, Govt. of India."),
            ("2. OIML International Recommendation R 76-1", "Metrological and technical specifications for Non-Automatic Weighing Instruments (Accuracy Classes I, II, III, IIII, eccentricity, and repeatability tests)."),
            ("3. Bureau of Indian Standards (BIS) & NPL Traceability", "Guidelines on reference standards, laboratory calibration hierarchy, and GATC verification protocols."),
            ("4. Department of Consumer Affairs E-Commerce Guidelines", "Mandates on digital stamping display and consumer verification for commercial trade transactions."),
            ("5. Live Working MetraVerify Prototype & Codebase", "Production-tested MERN architecture: https://github.com/Pushkar-8950/Ecommerce-Frontend")
        ]
        for idx, (title, desc) in enumerate(refs):
            p = tf.add_paragraph() if idx > 0 else tf.paragraphs[0]
            p.space_after = Pt(10)
            r1 = p.add_run()
            r1.text = f"{title}: "
            r1.font.bold = True
            r1.font.size = Pt(11)
            r1.font.color.rgb = RGBColor(15, 23, 42)
            
            r2 = p.add_run()
            r2.text = desc
            r2.font.bold = False
            r2.font.size = Pt(10)
            r2.font.color.rgb = RGBColor(71, 85, 105)

# 6. Add "TEAM: CHEETAH" badge on EVERY SLIDE
for slide_num, slide in enumerate(prs.slides):
    # Create top-right badge
    badge_left = Inches(10.6)
    badge_top = Inches(0.2)
    badge_width = Inches(2.5)
    badge_height = Inches(0.4)
    
    # Add rounded rectangle shape
    shape = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE,
        badge_left, badge_top, badge_width, badge_height
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = RGBColor(15, 23, 42) # Slate-900 dark badge
    shape.line.color.rgb = RGBColor(217, 119, 6) # Amber border
    shape.line.width = Pt(1.5)
    
    tf = shape.text_frame
    tf.word_wrap = False
    p = tf.paragraphs[0]
    p.text = "⚡ TEAM: CHEETAH"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = RGBColor(251, 191, 36) # Amber-400
    p.alignment = PP_ALIGN.CENTER

prs.save(OUTPUT_PPT)
print(f"✅ Successfully created winning presentation: {OUTPUT_PPT}")

