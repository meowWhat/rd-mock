import axios from '../__mocks__/axios'

describe('CURD  TEST', () => {
  test('delete test', async () => {
    const res = await axios({
      url: '/a',
      method: 'DELETE',
      data: { id: 1 },
    })
    expect(res.data.rtn).toBe(0)
    const res2 = await axios({
      url: '/a',
      method: 'DELETE',
      data: { id: 15 },
    })
    expect(res2.data.rtn).toBe(50001)
    const res3 = await axios({
      url: '/a',
      method: 'DELETE',
    })
    expect(res3.data.rtn).toBe(10002)
    const res4 = await axios({
      url: '/e',
      method: 'DELETE',
      data: { id: 5 },
    })
    expect(res4.data.rtn).toBe(50001)
    const res5 = await axios({
      url: '/e',
      method: 'DELETE',
      data: { id: 2 },
    })
    expect(res5.data.rtn).toBe(0)
  })
  test('post  test', async () => {
    const res1 = await axios({
      url: '/b',
      method: 'POST',
      data: { id: 3 },
    })
    expect(res1.data.rtn).toBe(0)

    const res2 = await axios({
      url: '/b',
      method: 'POST',
      data: { id: 1 },
    })
    expect(res2.data.rtn).toBe(50003)
    const res3 = await axios({
      url: '/b',
      method: 'POST',
    })
    expect(res3.data.rtn).toBe(0)

    const res4 = await axios({
      url: '/c',
      method: 'POST',
      data: { id: 2, name: 'post' },
    })
    expect(res4.data.rtn).toBe(0)
  })
  test('put test', async () => {
    const res1 = await axios({
      url: '/g',
      method: 'PUT',
      data: { id: 3, name: 'dddd' },
    })
    expect(res1.data.rtn).toBe(0)

    const res2 = await axios({
      url: '/d',
      method: 'PUT',
      data: { id: 3 },
    })
    expect(res2.data.rtn).toBe(50001)

    const res3 = await axios({
      url: '/d',
      method: 'PUT',
      data: { id: 2, name: 'ddd', message: 'oooo' },
    })
    expect(res3.data.rtn).toBe(0)
  })
  test('get test', async () => {
    expect((await axios.get('/user')).data.data.length).toBe(12)
    expect((await axios.get('/user?id=1')).data.data.length).toBe(1)
    expect((await axios.get('/user?money_num=50')).data.data.length).toBe(1)
    expect((await axios.get('/user?_page=2')).data.data.length).toBe(2)
    expect((await axios.get('/user?_page=1&_limit=5')).data.data.length).toBe(5)
    expect((await axios.get('/user?_start=0&_end=6')).data.data.length).toBe(6)
    expect((await axios.get('/user?id_lte=2')).data.data.length).toBe(1)
    expect((await axios.get('/user?money_gte=200')).data.data.length).toBe(7)
    expect((await axios.get('/user?id_ne=1')).data.data.length).toBe(10)
    expect((await axios.get('/user?title_like=xxx')).data.data.length).toBe(10)
    expect((await axios.get('/user?id_gte=0&_limit=12')).data.data.length).toBe(
      12
    )
  })
})
