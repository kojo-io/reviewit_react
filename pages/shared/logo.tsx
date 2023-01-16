export const Logo = () => {
  return (
      <div className={'space-y-2'}>
          <label className={'text-blue-600 text-6xl block font-light'}>
              review.it
          </label>
          <h1 className={'font-bold flex justify-end space-x-2'}>
              <span>Powered by</span>
              <img src="/tollesoft.png" className={'w-24 h-[18px]'} alt={'tollesoft.png'}/>
          </h1>
      </div>
  )
}