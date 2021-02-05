<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
</head>
<body>
  @if ($data['type'] == 'A' || $data['type'] == 'S')
  <h1 style="font-size: 40px; margin-bottom: 0; margin-top: 0; text-align: center;">
    echelon
  </h1>
  <div style="height: 18px; text-align: right; width: 58%">
    <div style="color: #808080; font-size: 16px;">Insurance</div>
  </div>
  <h3 style="margin-bottom: 5px;">Agreement to Bond</h3>
  <div style="margin-bottom: 80px;">(Surety's Consent)</div>
  <div style="clear: both; height: 25px; width: 100%;">
    <div style="float: left; width: 160px">Bond No.</div>
    <div style="float: left;">{{@$data['bond_no']}}</div>
  </div>
  <div style="clear: both; height: 25px; width: 100%;">
    <div style="float: left; width: 160px">Obligee:</div>
    <div style="float: left;">{{@$data['obligee']}}</div>
  </div>
  <div style="clear: both; height: 25px; width: 100%;">
    <div style="float: left; width: 160px">Contractor (Principal):</div>
    <div style="float: left;">{{@$data['legal']}}</div>
  </div>
  <div style="clear: both; height: 25px; width: 100%;">
    <div style="float: left; width: 160px">Contractor (Principal):</div>
    <div style="float: left;">{{date('j')}}th day of {{date('F, Y')}}</div>
  </div>
  <div style="clear: both; height: 25px; width: 100%;">
    <div style="float: left; width: 160px">Project:</div>
    <div style="float: left;">{{$data['description']}}</div>
  </div>
  <div style="clear: both; height: 25px; width: 100%;">
    <div style="float: left; width: 160px">Project No:</div>
    <div style="float: left;">{{$data['contract_no']}}</div>
  </div>
  <div style="line-height: 24px; margin: 30px 0 10px; width: 100%;">
    We Echelon Insurance, 2680 Matheson Blvd East, Suite 300, Mississauga,
     Ontario L4W OA5 a corporation created and existing under the laws of Canada
     and duly authorized to transact the business of Suretyship in all Provinces and
     all Territories of Canada, as Surety, agree to issue the following Bonds
     for the Principal if the Principal's tender is accepted by the Obligee within
     {{numberTowords($data['accept_period'])}} ( {{$data['accept_period']}} )
     days from the closing date of the tender and
     if the Principal shall have entered into a written
     contract with the Obligee.
  </div>
  <div style="margin: 10px 20px; width: 100%;">
    1. Performance Bond for
    {{numberTowords($data['performance_bond'])}} percent ( {{$data['performance_bond']}} %)
    of the tender price.
  </div>
  <div style="margin: 10px 20px; width: 100%;">
    2. Labour and Material Payment Bond for
    {{numberTowords($data['lmpayment_bond'])}} percent ( {{$data['lmpayment_bond']}} %)
    of the tender price.
  </div>
  <div style="margin: 10px 0; width: 100%;">
    This Agreement to Bond shall be null and void after
    {{numberTowords($data['accept_period'])}} ( {{$data['accept_period']}} )
     days from the award date.
  </div>
  <div style="margin-top: 30px; width: 100%;">
    Signed and Sealed this {{date('j')}}th day of {{date('F, Y')}}
  </div>
  <div style="clear: both; height: 220px; margin: 70px 0 0; width: 100%;">
    <div style="float: left; width: 50%"></div>
    <div style="float: left; width: 50%;">
      <h4 style="border-bottom: 1px solid #000000; margin-bottom: 0; width: 100%;">
        Echelon Insurance
      </h4>
      <span>Surety</span>
      <h4
        style="
          border-bottom: 1px solid #000000;
          height: 60px;
          margin-bottom: 0;
          width: 100%;
        "
      >
        
      </h4>
      <span>Attorney-in-Fact: {{$data['name']}}</span>
    </div>
  </div>
  <div style="clear: both; width: 100%;">
    <div>Echelon Insurance</div>
    <div>SURETY FORM 030E</div>
  </div>
  @endif

  @if ($data['type'] == 'B' || $data['type'] == 'S')
  <h1 style="font-size: 40px; margin-bottom: 0; margin-top: 0; text-align: center;">
    echelon
  </h1>
  <div style="height: 18px; text-align: right; width: 58%">
    <div style="color: #808080; font-size: 16px;">Insurance</div>
  </div>
  <h3 style="margin-bottom: 5px;">Bid Bond - CCDV</h3>
  <div>Standard Construction Document</div>
  <div style="margin-bottom: 20px;">CCDC 220 - 2002</div>
  <div style="margin-bottom: 5px;">Bond No.: {{$data['bond_no']}}</div>
  <div>
    Bond Amount: $ {{$data['percentage_amount']}}% of Tender Amount
  </div>
  <div style="line-height: 20px; margin: 10px 0; width: 100%;">
    {{$data['legal']}} as Principal, hereinafter called the Principal,
     and Echelon Insurance, corporation created and existing
     under the laws of Canada and duly authorized transact the business of
     Suretyship in all Provinces and all Territories in Canada as Surety,
     hereinafter called the Surety, are held and firmly bound unto
     {{$data['obligee']}} as Obligee, hereinafter called the Obligee, in the amount of
     {{numberTowords($data['percentage_amount'])}} Percent Of Tender Amount Dollars,
     ${{$data['percentage_amount']}}% Of Tender Amount lawful money of Canada,
     for the payment of which sum the Principal and the Surety bind themselves,
     their heirs, executors, administrators, successors and assigns, jointly and severally.
  </div>
  <div style="line-height: 20px; margin-bottom: 10px; width: 100%;">
    WHEREAS the Principal has entered into a written bid to the Obligee, dated the
    {{date('j')}}th day of {{date('F, Y')}} for {{$data['description']}}
    Project No.: {{$data['contract_no']}}.
  </div>
  <div style="line-height: 20px; width: 100%;">
    The Condition of this obligation is such that,
     if the Principal shall have the bid accepted within
     the time period prescribed in the Obligee's bid documents, or,
     if no time period is specified in the Obligee's bid documents, within
     {{numberTowords($data['accept_period'])}} ( {{$data['accept_period']}} )
     days from the closing date as specified in the Obligee's bid documents,
     and the Principal enters into a formal contract and gives the specified security,
     then this obligation shall be void; otherwise, provided the Obligee takes
     all reasonable steps to mitigate the amount of such excess costs,
     the Principal and the Surety will pay to the Obligee the difference in money
     between the amount of the bid of the Principal and the amount for which
     the Obligee legally contracts with another party to perform the work
     if the latter amount be in excess of the former.
  </div>
  <div style="line-height: 20px; margin-bottom: 10px; width: 100%;">
    The Principal and Surety shall not be liable for a greater sum than the Bond Amount.
  </div>
  <div style="line-height: 20px; margin-bottom: 10px; width: 100%;">
    It is a condition of this bond that any suit or action must be commenced
   within eighteen ( 18 ) months of the date of this Bond.
  </div>
  <div style="line-height: 20px; margin-bottom: 10px; width: 100%;">
    No right of action shall accrue hereunder to or for the use of any person
     or corporation other than the Obligee named herein,
     or the heirs, executors, administrators or successors of the Obligee.
  </div>
  <div style="line-height: 20px; margin-bottom: 10px; width: 100%;">
    IN WITNESS WHEREOF, the Principal and the Surety have Signed and Sealed this Bond dated the 
    {{date('j')}}th day of {{date('F, Y')}}.
  </div>
  <div style="margin-top: 10px; width: 100%;">
    Signed and Sealed this {{date('j')}}th day of {{date('F, Y')}}
  </div>
  <div style="clear: both; width: 100%;">
    <div style="float: left; padding: 0 20px; width: 45%">
      <h4
        style="
          border-bottom: 1px solid #000000;
          height: 10px;
          margin-bottom: 0;
          margin-top: 15px;
          width: 100%;
        "
      >
        
      </h4>
      <span>Witness:</span>
    </div>
    <div style="float: left; padding: 0 20px; width: 45%">
      <h4
        style="
          border-bottom: 1px solid #000000;
          height: 10px;
          margin-bottom: 0;
          margin-top: 15px;
          width: 100%;
        "
      >
        
      </h4>
      <span>Principal: {{$data['legal']}}
      <h4 style="border-bottom: 1px solid #000000; margin-bottom: 0; width: 100%;">
        Echelon Insurance
      </h4>
      <span>Surety</span>
      <h4
        style="
          border-bottom: 1px solid #000000;
          height: 60px;
          margin-bottom: 0;
          margin-top: 0;
          width: 100%;
        "
      >
        
      </h4>
      <span>Attorney-in-Fact: {{$data['name']}}</span>
    </div>
  </div>
  <div style="clear: both; width: 100%;">
    <div>Echelon Insurance</div>
    <div>SURETY FORM 030E</div>
  </div>
  @endif
</body>
</html>

<?php
  function numberTowords($num)
  {
    $num = (int)$num;

    if ($num == 0) {
      return "zero";
    }

    $ones = array(
      0 =>"zero",
      1 => "one",
      2 => "two",
      3 => "three",
      4 => "four",
      5 => "five",
      6 => "six",
      7 => "seven",
      8 => "eight",
      9 => "nine",
      10 => "ten",
      11 => "eleven",
      12 => "twelve",
      13 => "thirteen",
      14 => "fourteen",
      15 => "fifteen",
      16 => "sisteen",
      17 => "seventeen",
      18 => "eighteen",
      19 => "nineteen"
    );

    $tens = array( 
      0 => "zero",
      1 => "ten",
      2 => "twenty",
      3 => "thirty", 
      4 => "forty", 
      5 => "fifty", 
      6 => "sixty", 
      7 => "seventy", 
      8 => "eighty", 
      9 => "ninety" 
    );

    $hundreds = array( 
      "hundred"
    );

    $num = number_format($num, 2, ".", ",");
    $num_arr = explode(".", $num); 
    $wholenum = $num_arr[0]; 
    $decnum = $num_arr[1]; 
    $whole_arr = array_reverse(explode(",",$wholenum)); 
    krsort($whole_arr,1); 
    
    $rettxt = ""; 
    foreach ($whole_arr as $key => $i) {
      while (substr($i, 0, 1) == "0") {
        $i=substr($i,1,5);
      }

      if ($i < 20) { 
        $rettxt .= $ones[$i]; 
      } elseif ($i < 100) { 
        if (substr($i, 0, 1) != "0") $rettxt .= $tens[substr($i, 0, 1)]; 
        if (substr($i, 1, 1) != "0") $rettxt .= " ".$ones[substr($i, 1, 1)]; 
      } else { 
        if(substr($i, 0, 1) != "0") $rettxt .= $ones[substr($i, 0, 1)] . " " . $hundreds[0]; 
        if(substr($i, 1, 1) != "0") $rettxt .= " " . $tens[substr($i, 1, 1)]; 
        if(substr($i, 2, 1) != "0") $rettxt .= " " . $ones[substr($i, 2, 1)]; 
      } 

      if ($key > 0) {
        $rettxt .= " " . $hundreds[$key] . " "; 
      }
    } 

    if ($decnum > 0) {
      $rettxt .= " and ";
      if ($decnum < 20) {
        $rettxt .= $ones[$decnum];
      } elseif ($decnum < 100) {
        $rettxt .= $tens[substr($decnum, 0, 1)];
        $rettxt .= " ".$ones[substr($decnum, 1, 1)];
      }
    }
    
    return $rettxt;
  }
?>