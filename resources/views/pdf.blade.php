<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
</head>
<style>
.title {
  font-size: 28px;
  float: left;
  padding-top: 25px;
}
.logo {
  float: right;
  height: 96px;
  width: 200px;
}
</style>
<body>
  <div style="height: 100px; width: 100%">
    <span class="title">Tender Bond Request Form</span>
    <img class="logo" src="{{ public_path('images/logo.png') }}" />
  </div>
  <div style="height: 30px; width: 100%">
    <div style="float:left;">Date: {{date('F d, Y')}}</div>
    <div style="float: right;">Requested By: {{$data['legal']}}</div>
  </div>
  <div style="height: 30px; width: 100%">
    <div style="float:left;"></div>
    <div style="float: right;">Phone: 905-544-8118</div>
  </div>
  <div style="height: 30px; width: 100%">
    <div style="float:left;"></div>
    <div style="float: right;">Fax: 905-544-6815</div>
  </div>
  <div style="height: 30px; width: 100%">
    Contractor:
  </div>
  <div style="height: 30px; width: 100%">
    Closing Date & Time:&nbsp;
    {{date('F d, Y', strtotime($data['close_date']))}}&nbsp;
    @<?php echo substr($data['close_time'], 0, 5) ?>
  </div>
  <div style="height: 30px; width: 100%">
    Obligee (Owner): {{$data['obligee']}}
  </div>
  <div style="height: 30px; width: 100%">
    Job Description: {{$data['description']}}
  </div>
  <div style="height: 30px; width: 100%">
    Contract No.: {{$data['contract_no']}}
  </div>
  <div style="height: 30px; width: 100%">
    Estimated Contract Price: ${{$data['contract_price']}}
  </div>
  <div style="font-weight: bold; height: 30px; width: 100%">
    Bid Bond: {{$data['bid_bond'] == 1 ? 'YES' : 'NO'}}
  </div>
  <div style="height: 30px; margin-left: 50px; width: 100%">
    Stipulated Amount: ${{$data['stipulate_amount']}}
  </div>
  <div style="height: 30px; margin-left: 50px; width: 100%">
    Percentage Amount: {{$data['percentage_amount']}}%
  </div>
  <div style="font-weight: bold; height: 30px; width: 100%">
    Agreement to Bond: {{$data['agree_bond'] == 1 ? 'YES' : 'NO'}}
  </div>
  <div style="height: 30px; margin-left: 50px; width: 100%">
    Performance Bond: {{$data['performance_bond']}}%
  </div>
  <div style="height: 30px; margin-left: 50px; width: 100%">
    Labour & Material Bond: {{$data['lmpayment_bond']}}%
  </div>
  <div style="height: 30px; width: 100%">
    Maintenance Warranty: {{$data['warranty']}}
  </div>
  <div style="height: 30px; width: 100%">
    Acceptance Period: {{$data['accept_period']}} days
  </div>
  <div style="height: 30px; width: 100%">
    Penalty Clause (liquidated damages): ${{$data['penalty_clause']}}
  </div>
  <div style="height: 30px; width: 100%">
    Time to Complete: Completion {{date('M. d, Y', strtotime($data['end_date']))}}
  </div>
  <div style="height: 30px; width: 100%">
    Schedule:
  </div>
  <div style="height: 30px; width: 100%">
    Holdback Amount: ${{$data['holdback_amount']}}
  </div>
  <div style="height: 30px; width: 100%">
    Sublet (type of work & approximate value):
  </div>
  <div style="width: 100%">
    {{$data['sublet']}}
  </div>
  <div style="height: 30px; text-align: center; width: 100%">
    ** Please attach a copy of bond requirements and scope of work **
  </div>
</body>
</html>
