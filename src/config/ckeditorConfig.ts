
export const ckeditorConfig = {
  toolbar: [
    { name: 'document', items: ['Source'] },
    { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
    '/',
    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat'] },
    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote'] },
    { name: 'links', items: ['Link', 'Unlink'] },
    { name: 'insert', items: ['Image', 'Table', 'HorizontalRule'] },
    '/',
    { name: 'styles', items: ['Format', 'Font', 'FontSize'] },
    { name: 'colors', items: ['TextColor', 'BGColor'] },
    { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
    { name: 'tools', items: ['Maximize'] }
  ],
  height: 400,
  removePlugins: 'elementspath',
  resize_enabled: false,
  font_names: 'Poppins/Poppins, sans-serif;Arial/Arial, Helvetica, sans-serif;Times New Roman/Times New Roman, Times, serif;Verdana',
  font_defaultLabel: 'Poppins',
  fontSize_defaultLabel: '16px',
  format_tags: 'p;h1;h2;h3;h4;h5;h6;pre;address;div',
  stylesSet: [
    { name: 'Paragraph', element: 'p' },
    { name: 'Heading 1', element: 'h1' },
    { name: 'Heading 2', element: 'h2' },
    { name: 'Heading 3', element: 'h3' }
  ],
  contentsCss: [
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
  ]
};
