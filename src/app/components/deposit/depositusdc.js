import SendMoney from './send';
import WithdrawUsdc from './withdraw';

export default function YourPage() {

  return (
    <div className="contents mx-auto mt-8 p-8 bg-dark_light rounded shadow-md flex">
      <SendMoney />

      <WithdrawUsdc />

    </div>
  );
}
