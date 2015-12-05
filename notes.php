<?php 
    require 'vendor/autoload.php';
    $baseURI = "http://docent.cmi.hro.nl/bootb/restdemo/notes/";
    $client = new GuzzleHttp\Client();
    if (isset($_REQUEST["request"]))
    {
        $method = $_SERVER["REQUEST_METHOD"];
        switch ($_REQUEST["request"])
        {
            case "updateNote":
                $method = "PUT";
                break;
            case "deleteNote":
                $method = "DELETE";
                break;
        }
        note($client, $method, $baseURI, (isset($_REQUEST["options"])?$_REQUEST["options"]:[]));
    }

    function note($client, $method, $url, $options)
    {
        $response = $client->request($method, $url, $options);
        echo ($response->getBody() == ""?"{}":$response->getBody());
    }