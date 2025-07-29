// Sunflower Email Signature Generator
class SignatureGenerator {
    constructor() {
        this.form = document.getElementById('signatureForm');
        this.preview = document.getElementById('signaturePreview');
        this.actionButtons = document.getElementById('actionButtons');
        this.copyStatus = document.getElementById('copyStatus');
        this.modal = document.getElementById('instructionsModal');
        
        this.initializeEventListeners();
        this.loadSavedData();
    }

    initializeEventListeners() {
        // Form inputs - real-time preview
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updatePreview();
            });
            input.addEventListener('change', () => {
                this.updatePreview();
            });
            input.addEventListener('blur', () => {
                this.saveToLocalStorage();
                this.updatePreview();
            });
        });

        // Buttons
        document.getElementById('generateBtn').addEventListener('click', () => this.generateSignature());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearForm());
        document.getElementById('copyBtn').addEventListener('click', () => this.copySignature());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadSignature());
        document.getElementById('instructionsBtn').addEventListener('click', () => this.showInstructions());
        document.getElementById('closeModal').addEventListener('click', () => this.hideInstructions());

        // Modal close on background click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideInstructions();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display !== 'none') {
                this.hideInstructions();
            }
        });
    }

    getFormData() {
        return {
            fullName: document.getElementById('fullName')?.value.trim() || '',
            jobTitle: document.getElementById('jobTitle')?.value.trim() || '',
            companyName: document.getElementById('companyName')?.value.trim() || '',
            email: document.getElementById('email')?.value.trim() || '',
            phoneNumber: document.getElementById('phoneNumber')?.value.trim() || '',
            location: document.getElementById('location')?.value.trim() || '',
            website: document.getElementById('website')?.value.trim() || '',
            facebook: document.getElementById('facebook')?.value.trim() || '',
            instagram: document.getElementById('instagram')?.value.trim() || ''
        };
    }

    validateForm(data) {
        const errors = [];
        
        if (!data.fullName) {
            errors.push('Full Name is required');
        }
        
        if (!data.jobTitle) {
            errors.push('Job Title is required');
        }
        
        if (!data.companyName) {
            errors.push('Company Name is required');
        }
        
        if (!data.email) {
            errors.push('Email Address is required');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        
        if (data.website && !this.isValidUrl(data.website)) {
            errors.push('Please enter a valid website URL');
        }
        
        if (data.facebook && !this.isValidUrl(data.facebook)) {
            errors.push('Please enter a valid Facebook URL');
        }
        
        return errors;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    generateSignatureHTML(data) {
        // Process Instagram handle
        let instagramUrl = '';
        let instagramDisplay = data.instagram;
        
        if (data.instagram) {
            // Remove @ if present and create URL
            const handle = data.instagram.replace('@', '');
            instagramUrl = `https://www.instagram.com/${handle}/`;
            instagramDisplay = handle;
        }

        // Use default website if none provided
        const websiteUrl = data.website || 'https://www.sunflowerkid.com';
        const websiteDisplay = data.website ? 
            data.website.replace(/^https?:\/\//, '').replace(/\/$/, '') : 
            'www.sunflowerkid.com';

        return `
            <div>
                <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; color: #333333; max-width: 600px;">
                    <tr>
                        <td style="vertical-align: top; padding-right: 30px;">
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="font-family: 'Montserrat', Arial, sans-serif; font-size: 24px; font-weight: 600; color: #2c2c2c; padding-bottom: 3px;">
                                        ${data.fullName}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-family: 'Alice', serif; font-size: 14px; color: #666666; padding-bottom: 12px;">
                                        ${data.jobTitle}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-family: 'VAG Rounded', Arial, sans-serif; font-size: 14px; font-weight: bold; color: #2c2c2c; padding-bottom: 15px;">
                                        ${data.companyName || 'Sunflower Childcare Group Pte Ltd'}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table cellpadding="0" cellspacing="0" border="0">
                                            ${data.phoneNumber ? `
                                            <tr>
                                                <td style="padding: 2px 0;">
                                                    <table cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td style="width: 24px; padding-right: 10px;">
                                                                <img src="https://lh3.googleusercontent.com/d/1sRcrJs0EpkEGJIHvt1d-dz_5G3oWpXIQ" width="20" height="20" alt="Phone" style="display: block;">
                                                            </td>
                                                            <td style="font-family: 'VAG Rounded', Arial, sans-serif; font-size: 12px;">
                                                                <a href="tel:${data.phoneNumber.replace(/\s/g, '')}" style="color: #333333; text-decoration: none;">${data.phoneNumber}</a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            ` : ''}
                                            <tr>
                                                <td style="padding: 2px 0;">
                                                    <table cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td style="width: 24px; padding-right: 10px;">
                                                                <img src="https://lh3.googleusercontent.com/d/1X2PDjwAnYgpfh0tQHvZDzRPRUtW2kojn" width="20" height="20" alt="Email" style="display: block;">
                                                            </td>
                                                            <td style="font-family: 'VAG Rounded', Arial, sans-serif; font-size: 12px;">
                                                                <a href="mailto:${data.email}" style="color: #333333; text-decoration: none;">${data.email}</a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            ${data.location ? `
                                            <tr>
                                                <td style="padding: 2px 0;">
                                                    <table cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td style="width: 24px; padding-right: 10px;">
                                                                <img src="https://lh3.googleusercontent.com/d/1KZeuIwg_PRePcRpzpePNtMTqJ5OVgWnL" width="20" height="20" alt="Location" style="display: block;">
                                                            </td>
                                                            <td style="font-family: 'VAG Rounded', Arial, sans-serif; font-size: 12px;">
                                                                <span style="color: #333333;">${data.location}</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            ` : ''}
                                            <tr>
                                                <td style="padding: 2px 0;">
                                                    <table cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td style="width: 24px; padding-right: 10px;">
                                                                <img src="https://lh3.googleusercontent.com/d/12GR50PYa813tP7JJjBEPtZj_PwXkK54f" width="20" height="20" alt="Website" style="display: block;">
                                                            </td>
                                                            <td style="font-family: 'VAG Rounded', Arial, sans-serif; font-size: 12px;">
                                                                <a href="${websiteUrl}" style="color: #333333; text-decoration: none;">${websiteDisplay}</a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            ${data.facebook ? `
                                            <tr>
                                                <td style="padding: 2px 0;">
                                                    <table cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td style="width: 24px; padding-right: 10px;">
                                                                <img src="https://lh3.googleusercontent.com/d/1mMLCPHvIUWZaD10M9E-kGjyG7JbwUgA7" width="20" height="20" alt="Facebook" style="display: block;">
                                                            </td>
                                                            <td style="font-family: 'VAG Rounded', Arial, sans-serif; font-size: 12px;">
                                                                <a href="${data.facebook}" style="color: #333333; text-decoration: none;">Sunflower Childcare Group</a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            ` : ''}
                                            ${data.instagram ? `
                                            <tr>
                                                <td style="padding: 2px 0;">
                                                    <table cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td style="width: 24px; padding-right: 10px;">
                                                                <img src="https://lh3.googleusercontent.com/d/1-htPqSQUC8JrJXFtIu3U6HmN1VzzAp-l" width="20" height="20" alt="Instagram" style="display: block;">
                                                            </td>
                                                            <td style="font-family: 'VAG Rounded', Arial, sans-serif; font-size: 12px;">
                                                                <a href="${instagramUrl}" style="color: #333333; text-decoration: none;">${instagramDisplay}</a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            ` : ''}
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td style="vertical-align: top; text-align: center; width: 140px;">
                            <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                                <tr>
                                    <td style="text-align: center;">
                                        <img src="https://lh3.googleusercontent.com/d/1jyMkGfMMrs3oraejoV_0Du1PLBT-QOWJ" width="120" height="120" alt="Sunflower Logo" style="display: block; margin: 0 auto;">
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center; padding-top: 10px;">
                                        <div style="font-family: 'VAG Rounded', Arial, sans-serif; font-size: 12px; color: #4CAF50; font-weight: bold; line-height: 1.2;">
                                            We develop your child's<br>Multiple intelligences
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <div style="border-top: 1px solid #e0e0e0; padding-top: 8px; margin-top: 15px; font-family: Arial, sans-serif; font-size: 9px; color: #999999; line-height: 1.2; max-width: 600px;">
                    <strong>WARNING:</strong> Privileged / Confidential information may be contained in this message. If you are not the intended addressee, you must not copy, distribute or take any action in reliance thereon. Communication of any information in this email to any unauthorised person is an offence under the Official Secrets Act (Cap 213). Please notify the sender immediately if you receive this in error.
                </div>
            </div>
        `;
    }

    updatePreview() {
        const data = this.getFormData();
        
        if (!data.fullName && !data.jobTitle && !data.companyName && !data.email && !data.phoneNumber && !data.location) {
            this.preview.innerHTML = `
                <div class="placeholder">
                    <p>👈 Fill in your information to see your signature preview</p>
                </div>
            `;
            this.actionButtons.style.display = 'none';
            return;
        }

        const signatureHTML = this.generateSignatureHTML(data);
        this.preview.innerHTML = `<div class="generated-signature">${signatureHTML}</div>`;
        this.actionButtons.style.display = 'block';
    }

    generateSignature() {
        const data = this.getFormData();
        const errors = this.validateForm(data);
        
        if (errors.length > 0) {
            alert('Please fix the following errors:\n\n' + errors.join('\n'));
            return;
        }
        
        this.updatePreview();
        this.saveToLocalStorage();
        
        // Scroll to preview
        this.preview.scrollIntoView({ behavior: 'smooth' });
        
        // Show success message briefly
        this.showCopyStatus('✅ Signature generated successfully!', 'success');
    }

    async copySignature() {
        const data = this.getFormData();
        const errors = this.validateForm(data);
        
        if (errors.length > 0) {
            alert('Please fix the following errors before copying:\n\n' + errors.join('\n'));
            return;
        }
        
        const signatureHTML = this.generateSignatureHTML(data);
        
        try {
            // Create a temporary element to copy the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = signatureHTML;
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            document.body.appendChild(tempDiv);
            
            // Select and copy
            const range = document.createRange();
            range.selectNodeContents(tempDiv);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            const success = document.execCommand('copy');
            
            // Clean up
            document.body.removeChild(tempDiv);
            selection.removeAllRanges();
            
            if (success) {
                this.showCopyStatus('✅ Signature copied to clipboard!', 'success');
            } else {
                throw new Error('Copy command failed');
            }
        } catch (error) {
            console.error('Copy failed:', error);
            
            // Fallback: show the HTML in a textarea for manual copying
            const textarea = document.createElement('textarea');
            textarea.value = signatureHTML;
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            this.showCopyStatus('📋 Signature copied! (If this doesn\'t work, use the Download option)', 'warning');
        }
    }

    downloadSignature() {
        const data = this.getFormData();
        const errors = this.validateForm(data);
        
        if (errors.length > 0) {
            alert('Please fix the following errors before downloading:\n\n' + errors.join('\n'));
            return;
        }
        
        const signatureHTML = this.generateSignatureHTML(data);
        const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Signature - ${data.fullName}</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <h2>Your Sunflower Email Signature</h2>
    <p><strong>Instructions:</strong> Select all content below and copy (Ctrl+C), then paste into your Gmail signature settings.</p>
    <div style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
        ${signatureHTML}
    </div>
    <p><em>Generated by Sunflower Email Signature Generator</em></p>
</body>
</html>
        `;
        
        const blob = new Blob([fullHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.fullName.replace(/\s+/g, '_')}_email_signature.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showCopyStatus('💾 Signature downloaded successfully!', 'success');
    }

    showCopyStatus(message, type = 'success') {
        this.copyStatus.innerHTML = `<p>${message}</p>`;
        this.copyStatus.className = `copy-status copy-status-${type}`;
        this.copyStatus.style.display = 'block';
        
        setTimeout(() => {
            this.copyStatus.style.display = 'none';
        }, 3000);
    }

    clearForm() {
        if (confirm('Are you sure you want to clear all fields?')) {
            this.form.reset();
            this.updatePreview();
            this.clearLocalStorage();
            this.showCopyStatus('🗑️ Form cleared!', 'info');
        }
    }

    showInstructions() {
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    hideInstructions() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    saveToLocalStorage() {
        const data = this.getFormData();
        localStorage.setItem('sunflowerSignatureData', JSON.stringify(data));
    }

    loadSavedData() {
        try {
            const saved = localStorage.getItem('sunflowerSignatureData');
            if (saved) {
                const data = JSON.parse(saved);
                
                // Remove location field from saved data if it exists
                delete data.location;
                
                // Populate form fields
                Object.keys(data).forEach(key => {
                    const element = document.getElementById(key);
                    if (element && data[key]) {
                        element.value = data[key];
                    }
                });
                
                // Update preview if there's data
                if (data.fullName || data.jobTitle || data.email) {
                    this.updatePreview();
                }
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
            // Clear localStorage if there's an error to prevent future issues
            this.clearLocalStorage();
        }
    }

    clearLocalStorage() {
        localStorage.removeItem('sunflowerSignatureData');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SignatureGenerator();
});

// Add some utility CSS classes dynamically
const style = document.createElement('style');
style.textContent = `
    .copy-status-success {
        background: #d4edda !important;
        color: #155724 !important;
        border-color: #c3e6cb !important;
    }
    
    .copy-status-warning {
        background: #fff3cd !important;
        color: #856404 !important;
        border-color: #ffeaa7 !important;
    }
    
    .copy-status-info {
        background: #d1ecf1 !important;
        color: #0c5460 !important;
        border-color: #bee5eb !important;
    }
`;
document.head.appendChild(style);