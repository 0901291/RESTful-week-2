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
        note($client, $baseURI, $method, (isset($_REQUEST["extra"]) ? $_REQUEST["extra"] : ""), (isset($_REQUEST["id"]) ? $_REQUEST["id"] : ""), (isset($_REQUEST["note"]) ? $_REQUEST["note"] : []));
    }

    function note($client, $url, $method, $extra, $id, $note)
    {
        $response = $client->request($method, $url.$id.$extra, $note);
        echo ($response->getBody() == "" ? "{}" : $response->getBody());
    }