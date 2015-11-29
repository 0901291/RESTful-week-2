<?php 
    require 'vendor/autoload.php';
    $baseURI = "http://docent.cmi.hro.nl/bootb/restdemo/notes/";
    $client = new GuzzleHttp\Client();
    if (isset($_REQUEST["request"]))
    {
        switch ($_REQUEST["request"])
        {
            case "updateNote":
                note($client, $baseURI, $_REQUEST["note"]["id"], $_REQUEST["note"], "PUT");
                break;
            case "deleteNote":
                note($client, $baseURI, $_REQUEST["id"], [], "DELETE");
                break;
            default:
                note($client, $baseURI, (isset($_REQUEST["id"]) && $_REQUEST["id"] != "" ? $_REQUEST["id"] : ""), (isset($_REQUEST["note"]) && $_REQUEST["note"] != [] ? $_REQUEST["note"] : []), $_SERVER["REQUEST_METHOD"]);
                break;
        }
    }

    function note($client, $url, $id = "", $note = [], $method)
    {
        $response = $client->request($method, $url . $id, ["json" => $note]);
        echo ($response->getBody() == "" ? "{}" : $response->getBody());
    }