<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// File di memorizzazione sicuro in App_Data (scrivibile da PHP su Aruba e protetto da download web diretti)
$dataDir = __DIR__ . '/App_Data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}
$dataFile = $dataDir . '/stats.json';

// Inizializza il file se non esiste
if (!file_exists($dataFile)) {
    @file_put_contents($dataFile, json_encode(['site' => 0, 'artworks' => []], JSON_PRETTY_PRINT));
}

$action = isset($_GET['action']) ? $_GET['action'] : 'hit';
$target = isset($_GET['target']) ? trim($_GET['target']) : 'site';

// Sanitizzazione del nome target (solo alfanumerici, trattini e underscore)
$target = preg_replace('/[^a-zA-Z0-9_\-]/', '', $target);

$fp = @fopen($dataFile, 'c+');
if ($fp) {
    if (flock($fp, LOCK_EX)) {
        $size = filesize($dataFile);
        $content = $size > 0 ? fread($fp, $size) : '';
        $data = json_decode($content, true);

        if (!is_array($data)) {
            $data = ['site' => 0, 'artworks' => []];
        }
        if (!isset($data['site'])) {
            $data['site'] = 0;
        }
        if (!isset($data['artworks']) || !is_array($data['artworks'])) {
            $data['artworks'] = [];
        }

        if ($action === 'hit') {
            if ($target === 'site') {
                $data['site'] += 1;
            } elseif (!empty($target)) {
                if (!isset($data['artworks'][$target])) {
                    $data['artworks'][$target] = 0;
                }
                $data['artworks'][$target] += 1;
            }

            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, json_encode($data, JSON_PRETTY_PRINT));
            fflush($fp);
        }

        flock($fp, LOCK_UN);
        fclose($fp);

        echo json_encode([
            'success' => true,
            'target' => $target,
            'site' => (int)$data['site'],
            'views' => (!empty($target) && $target !== 'site') ? (int)($data['artworks'][$target] ?? 0) : null,
            'artworks' => $data['artworks']
        ]);
        exit;
    }
    fclose($fp);
}

// Fallback in caso di mancato lock
echo json_encode(['success' => false, 'error' => 'Storage lock error']);
