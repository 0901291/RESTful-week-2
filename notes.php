<?php 
    require 'vendor/autoload.php';
    $baseURI = "http://docent.cmi.hro.nl/bootb/restdemo/notes/";
    $client = new GuzzleHttp\Client();

    if (isset($_GET["request"]))
    {
        switch ($_GET["request"])
        {
            case "getAllNotes":
                getAllNotes($client, $baseURI);
                break;
        }
    }

    function getAllNotes($client, $url)
    {
        $response = $client->get($url);   
        echo $response->getBody();
    }
     
    // echo $response->getStatusCode();
    // "200" 
     
    // echo $response->getHeader('content-type')[0]; 
    // 'application/json; charset=utf8’  
    // geeft een array terug, waarvan ik de eerste gebruik   
    
    // [{"id":"1","title":... etc. 
     
    // $json = json_decode($response->getBody());  // zet json uit de body om in object 
     
    // echo $json[2]->title; 
    // haal 3e object uit collectie, en toon daarvan element title 
     
    // echo "send post as key value";   
    // $response = $client->post('http://uri', [  ’form_params' => [ 
    // ]);   
    // ’key' => ’value',  ’key2' => ’value2’ ] 
    // echo $response->getStatusCode();  // "201" 
     
    // echo "send post as json"; 
     
    // $response = $client->post('http://uri', ['json' => [’key' => ’value']]); 
     
    // echo $response->getStatusCode(); 
    // // "201" 
     
    // $response = $client->put('http://uri', ['json' => [’key' => ’changedvalue']]); 
    // // werkt hetzelfde als post 
     
    // echo $response->getStatusCode(); 
    // // "200" 
     
    // $response = $client->delete('http://uri');   
    // echo $response->getStatusCode();  // "204"