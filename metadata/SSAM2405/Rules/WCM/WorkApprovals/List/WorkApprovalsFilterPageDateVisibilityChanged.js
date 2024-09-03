import FilterPageDateVisibilityChanged from '../../Common/FilterPageDateVisibilityChanged';
import RedrawFilterToolbar from '../../../Filter/RedrawFilterToolbar';

export default function WorkApprovalsFilterPageDateVisibilityChanged(context) {
    RedrawFilterToolbar(context);
    FilterPageDateVisibilityChanged(context, 'WorkApprovalsListViewPage');
}
