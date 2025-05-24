
export const getEditorProps = (isFullscreen: boolean) => ({
  attributes: {
    class: `prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none ${
      isFullscreen ? 'min-h-[80vh]' : 'min-h-[400px]'
    } p-6`,
  },
  handleDrop: (view: any, event: DragEvent, slice: any, moved: boolean) => {
    if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      if (file.type.includes('image/')) {
        event.preventDefault();
        const reader = new FileReader();
        reader.onload = () => {
          const url = reader.result as string;
          view.dispatch(
            view.state.tr.replaceSelectionWith(
              view.state.schema.nodes.image.create({ src: url })
            )
          );
        };
        reader.readAsDataURL(file);
        return true;
      }
    }
    return false;
  },
});
