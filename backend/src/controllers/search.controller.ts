import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils/ApiResponse';
import { wrapperFx } from '@/utils/wrapperFx';

const sample = [
  {
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    pfp: '/placeholder-user.jpg',
    profile: '/profile/johndoe'
  },
  {
    id: 2,
    name: 'Jane Doe',
    username: 'janedoe',
    pfp: '/placeholder-user.jpg',
    profile: '/profile/janedoe'
  }
];

export const search = wrapperFx(async function (req: ExpressTypes.Req, res: ExpressTypes.Res) {
  const { q } = req.query;
  const query = q ? q.toString().toLowerCase().trim() : '';
  const result =
    query != ''
      ? sample.filter(
          user => user.username.includes(query) || user.name.includes(query)
        )
      : [];
  return new ApiResponse('Search successful', {
    query: query,
    searchResult: result
  }).success(res);
});
