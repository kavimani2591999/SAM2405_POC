import FilterPageDateVisibilityChanged from '../Common/FilterPageDateVisibilityChanged';
import RedrawFilterToolbar from '../../Filter/RedrawFilterToolbar';

export default function WorkPermitsFilterPageDateVisibilityChanged(context) {
    RedrawFilterToolbar(context);
    FilterPageDateVisibilityChanged(context, 'WorkPermitsListViewPage');
}
