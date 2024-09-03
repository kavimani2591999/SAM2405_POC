export default function RedrawFilterToolbar(context) {
    let toolbar = context.getPageProxy().getToolbar();
	toolbar.redraw();
}
