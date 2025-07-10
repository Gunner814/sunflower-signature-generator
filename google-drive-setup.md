# Google Drive Image Setup for Email Signature

## Steps to get the correct image URL:

1. **Find your image file:**
   - Go to your Google Drive folder
   - Locate "SF Logo Transparent.jpg"

2. **Get the shareable link:**
   - Right-click on the image
   - Select "Get link"
   - Change setting to "Anyone with the link can view"
   - Copy the link

3. **Extract the File ID:**
   - Your link will look like: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
   - Copy the FILE_ID part (the long string between `/d/` and `/view`)

4. **Create the direct image URL:**
   - Use this format: `https://drive.google.com/uc?export=view&id=FILE_ID`
   - Replace FILE_ID with your actual file ID

## Example:
If your sharing link is:
`https://drive.google.com/file/d/1ABC123xyz789/view?usp=sharing`

Your direct image URL will be:
`https://drive.google.com/uc?export=view&id=1ABC123xyz789`

## To implement:
1. Get your file ID following the steps above
2. Open `email-signature-inline.html`
3. Replace `FILE_ID_HERE` with your actual file ID
4. Save and test the signature

## Alternative method if the above doesn't work:
1. Right-click the image in Google Drive
2. Select "Open in new tab"
3. In the new tab, right-click the image
4. Select "Copy image address"
5. Use this URL directly (though it may be less reliable long-term)