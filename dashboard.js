/* ─── State ──────────────────────────────────────────────────── */
function getDefaultApiUrl() {
  var loc = window.location;
  if (loc.protocol === 'http:' || loc.protocol === 'https:') {
    return loc.origin + '/segcar/sketch_jul12a/api/public/index.php';
  }
  return 'http://localhost/segcar/sketch_jul12a/api/public/index.php';
}

var storedUrl = localStorage.getItem('segcar_url');
if (!storedUrl || storedUrl.indexOf(':8080') !== -1) {
  storedUrl = getDefaultApiUrl();
  localStorage.setItem('segcar_url', storedUrl);
}

// Rotas reais pré-carregadas seguindo as vias de Rio Claro-SP e Limeira-SP
const SEED_TRIPS_DATA = [
  {
    id: 100,
    client_id: 1,
    device_id: 'veiculo_001',
    name: 'Rio Claro para UNIP Limeira',
    origin_name: 'Rio Claro - SP',
    destination_name: 'UNIP Limeira',
    status: 'completed',
    start_time: '2026-10-28 18:12:47',
    end_time: '2026-10-28 19:10:05',
    total_distance_m: 37574.08,
    duration_seconds: 3438,
    avg_speed_kmh: 48.7,
    max_speed_kmh: 118.2,
    points_count: 1117,
    positions: [
      { latitude: -22.371706, longitude: -47.575347, velocidade_kmh: 0.0, altitude_m: 556.5, hora_utc: '21:12:41', data_utc: '28/10/2026', received_at: '2026-10-28 18:12:47', satelites: 11, hdop: 0.90 },
      { latitude: -22.371603, longitude: -47.577098, velocidade_kmh: 18.3, altitude_m: 542.9, hora_utc: '21:17:37', data_utc: '28/10/2026', received_at: '2026-10-28 18:17:37', satelites: 11, hdop: 0.90 },
      { latitude: -22.373785, longitude: -47.578052, velocidade_kmh: 31.0, altitude_m: 562.7, hora_utc: '21:18:25', data_utc: '28/10/2026', received_at: '2026-10-28 18:18:25', satelites: 10, hdop: 1.00 },
      { latitude: -22.375514, longitude: -47.579257, velocidade_kmh: 30.9, altitude_m: 565.6, hora_utc: '21:19:01', data_utc: '28/10/2026', received_at: '2026-10-28 18:19:01', satelites: 11, hdop: 0.90 },
      { latitude: -22.376895, longitude: -47.581027, velocidade_kmh: 32.8, altitude_m: 566.9, hora_utc: '21:19:51', data_utc: '28/10/2026', received_at: '2026-10-28 18:19:51', satelites: 11, hdop: 0.90 },
      { latitude: -22.378427, longitude: -47.582862, velocidade_kmh: 19.2, altitude_m: 545.0, hora_utc: '21:20:23', data_utc: '28/10/2026', received_at: '2026-10-28 18:20:23', satelites: 11, hdop: 0.90 },
      { latitude: -22.379682, longitude: -47.582683, velocidade_kmh: 33.9, altitude_m: 548.2, hora_utc: '21:20:53', data_utc: '28/10/2026', received_at: '2026-10-28 18:20:53', satelites: 11, hdop: 0.90 },
      { latitude: -22.381492, longitude: -47.582275, velocidade_kmh: 27.1, altitude_m: 562.7, hora_utc: '21:21:19', data_utc: '28/10/2026', received_at: '2026-10-28 18:21:19', satelites: 11, hdop: 0.90 },
      { latitude: -22.383415, longitude: -47.582199, velocidade_kmh: 37.4, altitude_m: 587.1, hora_utc: '21:21:47', data_utc: '28/10/2026', received_at: '2026-10-28 18:21:47', satelites: 11, hdop: 0.90 },
      { latitude: -22.384986, longitude: -47.580940, velocidade_kmh: 46.6, altitude_m: 612.1, hora_utc: '21:22:11', data_utc: '28/10/2026', received_at: '2026-10-28 18:22:11', satelites: 11, hdop: 0.90 },
      { latitude: -22.387285, longitude: -47.580768, velocidade_kmh: 24.7, altitude_m: 629.1, hora_utc: '21:22:39', data_utc: '28/10/2026', received_at: '2026-10-28 18:22:39', satelites: 11, hdop: 0.90 },
      { latitude: -22.389341, longitude: -47.579917, velocidade_kmh: 36.5, altitude_m: 622.5, hora_utc: '21:23:17', data_utc: '28/10/2026', received_at: '2026-10-28 18:23:17', satelites: 11, hdop: 0.90 },
      { latitude: -22.391210, longitude: -47.579151, velocidade_kmh: 14.7, altitude_m: 621.6, hora_utc: '21:23:49', data_utc: '28/10/2026', received_at: '2026-10-28 18:23:49', satelites: 11, hdop: 0.90 },
      { latitude: -22.393526, longitude: -47.578178, velocidade_kmh: 11.5, altitude_m: 622.9, hora_utc: '21:24:17', data_utc: '28/10/2026', received_at: '2026-10-28 18:24:17', satelites: 11, hdop: 0.90 },
      { latitude: -22.395526, longitude: -47.577362, velocidade_kmh: 40.7, altitude_m: 620.8, hora_utc: '21:24:55', data_utc: '28/10/2026', received_at: '2026-10-28 18:24:55', satelites: 11, hdop: 0.90 },
      { latitude: -22.397583, longitude: -47.576499, velocidade_kmh: 38.6, altitude_m: 619.6, hora_utc: '21:25:27', data_utc: '28/10/2026', received_at: '2026-10-28 18:25:27', satelites: 10, hdop: 1.00 },
      { latitude: -22.399793, longitude: -47.575862, velocidade_kmh: 32.3, altitude_m: 608.9, hora_utc: '21:25:59', data_utc: '28/10/2026', received_at: '2026-10-28 18:25:59', satelites: 10, hdop: 1.00 },
      { latitude: -22.401678, longitude: -47.575855, velocidade_kmh: 37.5, altitude_m: 599.4, hora_utc: '21:26:41', data_utc: '28/10/2026', received_at: '2026-10-28 18:26:41', satelites: 10, hdop: 1.00 },
      { latitude: -22.403560, longitude: -47.576831, velocidade_kmh: 23.9, altitude_m: 606.5, hora_utc: '21:27:05', data_utc: '28/10/2026', received_at: '2026-10-28 18:27:05', satelites: 10, hdop: 1.00 },
      { latitude: -22.405342, longitude: -47.578071, velocidade_kmh: 25.3, altitude_m: 612.0, hora_utc: '21:27:33', data_utc: '28/10/2026', received_at: '2026-10-28 18:27:33', satelites: 10, hdop: 1.00 },
      { latitude: -22.406013, longitude: -47.580101, velocidade_kmh: 32.9, altitude_m: 629.4, hora_utc: '21:28:03', data_utc: '28/10/2026', received_at: '2026-10-28 18:28:03', satelites: 10, hdop: 1.00 },
      { latitude: -22.406084, longitude: -47.582454, velocidade_kmh: 55.6, altitude_m: 616.9, hora_utc: '21:28:41', data_utc: '28/10/2026', received_at: '2026-10-28 18:28:41', satelites: 10, hdop: 1.00 },
      { latitude: -22.405769, longitude: -47.585285, velocidade_kmh: 34.6, altitude_m: 618.0, hora_utc: '21:29:21', data_utc: '28/10/2026', received_at: '2026-10-28 18:29:21', satelites: 10, hdop: 1.00 },
      { latitude: -22.405607, longitude: -47.588584, velocidade_kmh: 57.2, altitude_m: 599.8, hora_utc: '21:29:45', data_utc: '28/10/2026', received_at: '2026-10-28 18:29:45', satelites: 9, hdop: 1.10 },
      { latitude: -22.406064, longitude: -47.589637, velocidade_kmh: 8.2, altitude_m: 603.4, hora_utc: '21:30:09', data_utc: '28/10/2026', received_at: '2026-10-28 18:30:09', satelites: 10, hdop: 1.00 },
      { latitude: -22.408483, longitude: -47.586608, velocidade_kmh: 78.0, altitude_m: 602.8, hora_utc: '21:30:33', data_utc: '28/10/2026', received_at: '2026-10-28 18:30:33', satelites: 10, hdop: 1.00 },
      { latitude: -22.412200, longitude: -47.583412, velocidade_kmh: 69.2, altitude_m: 605.7, hora_utc: '21:30:57', data_utc: '28/10/2026', received_at: '2026-10-28 18:30:57', satelites: 10, hdop: 1.00 },
      { latitude: -22.414596, longitude: -47.582141, velocidade_kmh: 11.2, altitude_m: 616.4, hora_utc: '21:31:35', data_utc: '28/10/2026', received_at: '2026-10-28 18:31:35', satelites: 10, hdop: 1.00 },
      { latitude: -22.416664, longitude: -47.579925, velocidade_kmh: 67.7, altitude_m: 604.1, hora_utc: '21:35:27', data_utc: '28/10/2026', received_at: '2026-10-28 18:35:27', satelites: 9, hdop: 1.10 },
      { latitude: -22.420730, longitude: -47.577339, velocidade_kmh: 100.3, altitude_m: 585.7, hora_utc: '21:35:51', data_utc: '28/10/2026', received_at: '2026-10-28 18:35:51', satelites: 9, hdop: 1.10 },
      { latitude: -22.426160, longitude: -47.574607, velocidade_kmh: 100.7, altitude_m: 599.6, hora_utc: '21:36:15', data_utc: '28/10/2026', received_at: '2026-10-28 18:36:15', satelites: 9, hdop: 1.10 },
      { latitude: -22.431440, longitude: -47.571990, velocidade_kmh: 85.1, altitude_m: 622.6, hora_utc: '21:36:39', data_utc: '28/10/2026', received_at: '2026-10-28 18:36:39', satelites: 9, hdop: 1.10 },
      { latitude: -22.436569, longitude: -47.569366, velocidade_kmh: 97.0, altitude_m: 624.9, hora_utc: '21:37:03', data_utc: '28/10/2026', received_at: '2026-10-28 18:37:03', satelites: 9, hdop: 1.10 },
      { latitude: -22.441240, longitude: -47.566394, velocidade_kmh: 91.0, altitude_m: 604.5, hora_utc: '21:37:27', data_utc: '28/10/2026', received_at: '2026-10-28 18:37:27', satelites: 9, hdop: 1.10 },
      { latitude: -22.445423, longitude: -47.563007, velocidade_kmh: 94.3, altitude_m: 600.7, hora_utc: '21:37:51', data_utc: '28/10/2026', received_at: '2026-10-28 18:37:51', satelites: 9, hdop: 1.10 },
      { latitude: -22.450250, longitude: -47.558193, velocidade_kmh: 112.2, altitude_m: 555.8, hora_utc: '21:38:15', data_utc: '28/10/2026', received_at: '2026-10-28 18:38:15', satelites: 10, hdop: 1.00 },
      { latitude: -22.454643, longitude: -47.552318, velocidade_kmh: 117.0, altitude_m: 558.9, hora_utc: '21:38:39', data_utc: '28/10/2026', received_at: '2026-10-28 18:38:39', satelites: 10, hdop: 1.00 },
      { latitude: -22.458070, longitude: -47.546203, velocidade_kmh: 108.4, altitude_m: 582.7, hora_utc: '21:39:03', data_utc: '28/10/2026', received_at: '2026-10-28 18:39:03', satelites: 10, hdop: 1.00 },
      { latitude: -22.460594, longitude: -47.540016, velocidade_kmh: 103.2, altitude_m: 608.6, hora_utc: '21:39:27', data_utc: '28/10/2026', received_at: '2026-10-28 18:39:27', satelites: 10, hdop: 1.00 },
      { latitude: -22.462066, longitude: -47.533386, velocidade_kmh: 107.1, altitude_m: 608.7, hora_utc: '21:39:51', data_utc: '28/10/2026', received_at: '2026-10-28 18:39:51', satelites: 10, hdop: 1.00 },
      { latitude: -22.462249, longitude: -47.526443, velocidade_kmh: 112.1, altitude_m: 602.5, hora_utc: '21:40:15', data_utc: '28/10/2026', received_at: '2026-10-28 18:40:15', satelites: 10, hdop: 1.00 },
      { latitude: -22.464542, longitude: -47.519565, velocidade_kmh: 110.0, altitude_m: 594.0, hora_utc: '21:40:39', data_utc: '28/10/2026', received_at: '2026-10-28 18:40:39', satelites: 10, hdop: 1.00 },
      { latitude: -22.466983, longitude: -47.513656, velocidade_kmh: 84.3, altitude_m: 598.9, hora_utc: '21:41:03', data_utc: '28/10/2026', received_at: '2026-10-28 18:41:03', satelites: 10, hdop: 1.00 },
      { latitude: -22.469169, longitude: -47.508506, velocidade_kmh: 92.3, altitude_m: 619.1, hora_utc: '21:41:27', data_utc: '28/10/2026', received_at: '2026-10-28 18:41:27', satelites: 10, hdop: 1.00 },
      { latitude: -22.471479, longitude: -47.503196, velocidade_kmh: 87.5, altitude_m: 612.8, hora_utc: '21:41:51', data_utc: '28/10/2026', received_at: '2026-10-28 18:41:51', satelites: 10, hdop: 1.00 },
      { latitude: -22.473472, longitude: -47.497524, velocidade_kmh: 92.2, altitude_m: 637.1, hora_utc: '21:42:15', data_utc: '28/10/2026', received_at: '2026-10-28 18:42:15', satelites: 10, hdop: 1.00 },
      { latitude: -22.475177, longitude: -47.491802, velocidade_kmh: 92.7, altitude_m: 656.2, hora_utc: '21:42:39', data_utc: '28/10/2026', received_at: '2026-10-28 18:42:39', satelites: 10, hdop: 1.00 },
      { latitude: -22.477184, longitude: -47.485137, velocidade_kmh: 116.3, altitude_m: 639.8, hora_utc: '21:43:03', data_utc: '28/10/2026', received_at: '2026-10-28 18:43:03', satelites: 10, hdop: 1.00 },
      { latitude: -22.479253, longitude: -47.478363, velocidade_kmh: 99.3, altitude_m: 662.3, hora_utc: '21:43:27', data_utc: '28/10/2026', received_at: '2026-10-28 18:43:27', satelites: 10, hdop: 1.00 },
      { latitude: -22.480955, longitude: -47.472805, velocidade_kmh: 78.4, altitude_m: 677.7, hora_utc: '21:43:51', data_utc: '28/10/2026', received_at: '2026-10-28 18:43:51', satelites: 10, hdop: 1.00 },
      { latitude: -22.482524, longitude: -47.467460, velocidade_kmh: 88.5, altitude_m: 702.7, hora_utc: '21:44:15', data_utc: '28/10/2026', received_at: '2026-10-28 18:44:15', satelites: 9, hdop: 1.00 },
      { latitude: -22.484079, longitude: -47.462436, velocidade_kmh: 62.7, altitude_m: 693.8, hora_utc: '21:44:39', data_utc: '28/10/2026', received_at: '2026-10-28 18:44:39', satelites: 10, hdop: 1.00 },
      { latitude: -22.485858, longitude: -47.462253, velocidade_kmh: 29.1, altitude_m: 671.2, hora_utc: '21:45:05', data_utc: '28/10/2026', received_at: '2026-10-28 18:45:05', satelites: 10, hdop: 1.00 },
      { latitude: -22.487848, longitude: -47.463714, velocidade_kmh: 14.7, altitude_m: 671.6, hora_utc: '21:45:33', data_utc: '28/10/2026', received_at: '2026-10-28 18:45:33', satelites: 10, hdop: 1.00 },
      { latitude: -22.489900, longitude: -47.464714, velocidade_kmh: 42.7, altitude_m: 673.4, hora_utc: '21:46:01', data_utc: '28/10/2026', received_at: '2026-10-28 18:46:01', satelites: 10, hdop: 1.00 },
      { latitude: -22.493297, longitude: -47.465129, velocidade_kmh: 66.4, altitude_m: 654.0, hora_utc: '21:46:25', data_utc: '28/10/2026', received_at: '2026-10-28 18:46:25', satelites: 10, hdop: 1.00 },
      { latitude: -22.497022, longitude: -47.464290, velocidade_kmh: 59.4, altitude_m: 651.4, hora_utc: '21:46:49', data_utc: '28/10/2026', received_at: '2026-10-28 18:46:49', satelites: 10, hdop: 1.00 },
      { latitude: -22.500349, longitude: -47.462482, velocidade_kmh: 68.0, altitude_m: 644.0, hora_utc: '21:47:13', data_utc: '28/10/2026', received_at: '2026-10-28 18:47:13', satelites: 10, hdop: 1.00 },
      { latitude: -22.504089, longitude: -47.460498, velocidade_kmh: 72.4, altitude_m: 632.0, hora_utc: '21:47:37', data_utc: '28/10/2026', received_at: '2026-10-28 18:47:37', satelites: 10, hdop: 1.00 },
      { latitude: -22.507862, longitude: -47.458347, velocidade_kmh: 74.7, altitude_m: 626.2, hora_utc: '21:48:01', data_utc: '28/10/2026', received_at: '2026-10-28 18:48:01', satelites: 10, hdop: 1.00 },
      { latitude: -22.510955, longitude: -47.455444, velocidade_kmh: 66.1, altitude_m: 629.8, hora_utc: '21:48:25', data_utc: '28/10/2026', received_at: '2026-10-28 18:48:25', satelites: 10, hdop: 1.00 },
      { latitude: -22.513908, longitude: -47.452579, velocidade_kmh: 60.9, altitude_m: 630.3, hora_utc: '21:48:49', data_utc: '28/10/2026', received_at: '2026-10-28 18:48:49', satelites: 10, hdop: 1.00 },
      { latitude: -22.517124, longitude: -47.449329, velocidade_kmh: 71.2, altitude_m: 623.0, hora_utc: '21:49:13', data_utc: '28/10/2026', received_at: '2026-10-28 18:49:13', satelites: 10, hdop: 1.00 },
      { latitude: -22.519954, longitude: -47.446456, velocidade_kmh: 62.7, altitude_m: 648.6, hora_utc: '21:49:37', data_utc: '28/10/2026', received_at: '2026-10-28 18:49:37', satelites: 10, hdop: 1.00 },
      { latitude: -22.522890, longitude: -47.443695, velocidade_kmh: 61.0, altitude_m: 634.0, hora_utc: '21:50:01', data_utc: '28/10/2026', received_at: '2026-10-28 18:50:01', satelites: 10, hdop: 1.00 },
      { latitude: -22.525774, longitude: -47.440090, velocidade_kmh: 75.0, altitude_m: 599.2, hora_utc: '21:50:25', data_utc: '28/10/2026', received_at: '2026-10-28 18:50:25', satelites: 10, hdop: 1.00 },
      { latitude: -22.528045, longitude: -47.436401, velocidade_kmh: 64.7, altitude_m: 605.9, hora_utc: '21:50:49', data_utc: '28/10/2026', received_at: '2026-10-28 18:50:49', satelites: 10, hdop: 1.00 },
      { latitude: -22.530076, longitude: -47.434020, velocidade_kmh: 25.5, altitude_m: 619.6, hora_utc: '21:51:13', data_utc: '28/10/2026', received_at: '2026-10-28 18:51:13', satelites: 10, hdop: 1.00 },
      { latitude: -22.532007, longitude: -47.431957, velocidade_kmh: 51.4, altitude_m: 624.4, hora_utc: '21:51:39', data_utc: '28/10/2026', received_at: '2026-10-28 18:51:39', satelites: 10, hdop: 1.00 },
      { latitude: -22.534589, longitude: -47.429817, velocidade_kmh: 59.3, altitude_m: 615.4, hora_utc: '21:52:03', data_utc: '28/10/2026', received_at: '2026-10-28 18:52:03', satelites: 10, hdop: 1.00 },
      { latitude: -22.537706, longitude: -47.428272, velocidade_kmh: 57.7, altitude_m: 594.5, hora_utc: '21:52:27', data_utc: '28/10/2026', received_at: '2026-10-28 18:52:27', satelites: 10, hdop: 1.00 },
      { latitude: -22.540485, longitude: -47.427028, velocidade_kmh: 31.3, altitude_m: 581.0, hora_utc: '21:52:53', data_utc: '28/10/2026', received_at: '2026-10-28 18:52:53', satelites: 10, hdop: 1.00 },
      { latitude: -22.542463, longitude: -47.425140, velocidade_kmh: 51.3, altitude_m: 579.6, hora_utc: '21:53:17', data_utc: '28/10/2026', received_at: '2026-10-28 18:53:17', satelites: 10, hdop: 1.00 },
      { latitude: -22.544254, longitude: -47.422920, velocidade_kmh: 27.7, altitude_m: 569.1, hora_utc: '21:53:43', data_utc: '28/10/2026', received_at: '2026-10-28 18:53:43', satelites: 10, hdop: 1.00 },
      { latitude: -22.545499, longitude: -47.421642, velocidade_kmh: 4.9, altitude_m: 572.7, hora_utc: '21:54:17', data_utc: '28/10/2026', received_at: '2026-10-28 18:54:17', satelites: 10, hdop: 1.00 },
      { latitude: -22.545152, longitude: -47.418792, velocidade_kmh: 54.6, altitude_m: 595.7, hora_utc: '21:54:49', data_utc: '28/10/2026', received_at: '2026-10-28 18:54:49', satelites: 9, hdop: 1.20 },
      { latitude: -22.545022, longitude: -47.415996, velocidade_kmh: 11.0, altitude_m: 581.0, hora_utc: '21:55:19', data_utc: '28/10/2026', received_at: '2026-10-28 18:55:19', satelites: 9, hdop: 1.20 },
      { latitude: -22.544418, longitude: -47.413249, velocidade_kmh: 34.4, altitude_m: 561.5, hora_utc: '21:55:43', data_utc: '28/10/2026', received_at: '2026-10-28 18:55:43', satelites: 9, hdop: 1.20 },
      { latitude: -22.542972, longitude: -47.410964, velocidade_kmh: 63.4, altitude_m: 562.6, hora_utc: '21:56:19', data_utc: '28/10/2026', received_at: '2026-10-28 18:56:19', satelites: 10, hdop: 1.00 },
      { latitude: -22.543680, longitude: -47.407173, velocidade_kmh: 61.9, altitude_m: 579.3, hora_utc: '21:56:43', data_utc: '28/10/2026', received_at: '2026-10-28 18:56:43', satelites: 9, hdop: 1.20 },
      { latitude: -22.543884, longitude: -47.404216, velocidade_kmh: 29.9, altitude_m: 572.7, hora_utc: '21:57:07', data_utc: '28/10/2026', received_at: '2026-10-28 18:57:07', satelites: 10, hdop: 1.00 },
      { latitude: -22.544067, longitude: -47.400989, velocidade_kmh: 52.3, altitude_m: 564.8, hora_utc: '21:57:31', data_utc: '28/10/2026', received_at: '2026-10-28 18:57:31', satelites: 8, hdop: 1.30 },
      { latitude: -22.544652, longitude: -47.398185, velocidade_kmh: 50.0, altitude_m: 577.5, hora_utc: '21:57:55', data_utc: '28/10/2026', received_at: '2026-10-28 18:57:55', satelites: 9, hdop: 1.20 },
      { latitude: -22.545131, longitude: -47.395107, velocidade_kmh: 59.1, altitude_m: 593.2, hora_utc: '21:58:27', data_utc: '28/10/2026', received_at: '2026-10-28 18:58:27', satelites: 10, hdop: 1.00 },
      { latitude: -22.545864, longitude: -47.390880, velocidade_kmh: 69.1, altitude_m: 616.2, hora_utc: '21:58:51', data_utc: '28/10/2026', received_at: '2026-10-28 18:58:51', satelites: 9, hdop: 1.20 },
      { latitude: -22.546281, longitude: -47.387458, velocidade_kmh: 38.3, altitude_m: 611.6, hora_utc: '21:59:15', data_utc: '28/10/2026', received_at: '2026-10-28 18:59:15', satelites: 10, hdop: 1.00 },
      { latitude: -22.544624, longitude: -47.386375, velocidade_kmh: 37.1, altitude_m: 632.8, hora_utc: '22:00:03', data_utc: '28/10/2026', received_at: '2026-10-28 19:00:03', satelites: 10, hdop: 1.00 },
      { latitude: -22.541915, longitude: -47.384933, velocidade_kmh: 57.7, altitude_m: 669.7, hora_utc: '22:00:27', data_utc: '28/10/2026', received_at: '2026-10-28 19:00:27', satelites: 10, hdop: 1.00 },
      { latitude: -22.539091, longitude: -47.383388, velocidade_kmh: 42.2, altitude_m: 666.5, hora_utc: '22:00:51', data_utc: '28/10/2026', received_at: '2026-10-28 19:00:51', satelites: 10, hdop: 1.00 },
      { latitude: -22.537200, longitude: -47.382133, velocidade_kmh: 15.7, altitude_m: 656.7, hora_utc: '22:01:23', data_utc: '28/10/2026', received_at: '2026-10-28 19:01:23', satelites: 10, hdop: 1.00 },
      { latitude: -22.539777, longitude: -47.380401, velocidade_kmh: 48.5, altitude_m: 659.5, hora_utc: '22:01:49', data_utc: '28/10/2026', received_at: '2026-10-28 19:01:49', satelites: 10, hdop: 1.00 },
      { latitude: -22.542270, longitude: -47.378723, velocidade_kmh: 42.9, altitude_m: 659.1, hora_utc: '22:02:13', data_utc: '28/10/2026', received_at: '2026-10-28 19:02:13', satelites: 10, hdop: 1.00 },
      { latitude: -22.544281, longitude: -47.377826, velocidade_kmh: 2.5, altitude_m: 651.4, hora_utc: '22:02:49', data_utc: '28/10/2026', received_at: '2026-10-28 19:02:49', satelites: 10, hdop: 1.00 },
      { latitude: -22.544761, longitude: -47.378620, velocidade_kmh: 0.0, altitude_m: 643.4, hora_utc: '22:10:05', data_utc: '28/10/2026', received_at: '2026-10-28 19:10:05', satelites: 3, hdop: 3.00 }
    ]
  },
  {
    id: 1,
    client_id: 1,
    device_id: 'veiculo_001',
    name: 'Floridiana para Centro (Mercado)',
    origin_name: 'Jardim Floridiana',
    destination_name: 'Mercado Municipal',
    status: 'completed',
    start_time: '2026-08-18 08:10:00',
    end_time: '2026-08-18 08:22:00',
    total_distance_m: 3920.00,
    duration_seconds: 720,
    avg_speed_kmh: 32.7,
    max_speed_kmh: 49.2,
    points_count: 17,
    positions: [
      { latitude: -22.382845, longitude: -47.554312, velocidade_kmh: 0.0, altitude_m: 615.0, hora_utc: '11:10:00', satelites: 10, hdop: 0.9 },
      { latitude: -22.384210, longitude: -47.554480, velocidade_kmh: 22.0, altitude_m: 614.0, hora_utc: '11:10:45', satelites: 10, hdop: 0.9 },
      { latitude: -22.386500, longitude: -47.554800, velocidade_kmh: 35.0, altitude_m: 613.0, hora_utc: '11:11:30', satelites: 11, hdop: 0.8 },
      { latitude: -22.389200, longitude: -47.555250, velocidade_kmh: 42.0, altitude_m: 612.0, hora_utc: '11:12:15', satelites: 11, hdop: 0.8 },
      { latitude: -22.392100, longitude: -47.555700, velocidade_kmh: 45.5, altitude_m: 610.0, hora_utc: '11:13:00', satelites: 12, hdop: 0.8 },
      { latitude: -22.394800, longitude: -47.556100, velocidade_kmh: 48.0, altitude_m: 609.0, hora_utc: '11:13:45', satelites: 12, hdop: 0.8 },
      { latitude: -22.397500, longitude: -47.556500, velocidade_kmh: 49.2, altitude_m: 608.0, hora_utc: '11:14:30', satelites: 12, hdop: 0.8 },
      { latitude: -22.400200, longitude: -47.556900, velocidade_kmh: 44.0, altitude_m: 607.0, hora_utc: '11:15:15', satelites: 11, hdop: 0.8 },
      { latitude: -22.403100, longitude: -47.557350, velocidade_kmh: 40.0, altitude_m: 607.0, hora_utc: '11:16:00', satelites: 11, hdop: 0.8 },
      { latitude: -22.406200, longitude: -47.557800, velocidade_kmh: 36.0, altitude_m: 608.0, hora_utc: '11:16:45', satelites: 11, hdop: 0.8 },
      { latitude: -22.409500, longitude: -47.558300, velocidade_kmh: 28.0, altitude_m: 609.0, hora_utc: '11:17:30', satelites: 10, hdop: 0.9 },
      { latitude: -22.410350, longitude: -47.559400, velocidade_kmh: 25.0, altitude_m: 610.0, hora_utc: '11:18:15', satelites: 10, hdop: 0.9 },
      { latitude: -22.410400, longitude: -47.561500, velocidade_kmh: 32.0, altitude_m: 611.0, hora_utc: '11:19:00', satelites: 10, hdop: 0.9 },
      { latitude: -22.410480, longitude: -47.563800, velocidade_kmh: 24.0, altitude_m: 613.0, hora_utc: '11:19:45', satelites: 9, hdop: 1.0 },
      { latitude: -22.411600, longitude: -47.563920, velocidade_kmh: 18.0, altitude_m: 613.0, hora_utc: '11:20:30', satelites: 9, hdop: 1.0 },
      { latitude: -22.412450, longitude: -47.564050, velocidade_kmh: 6.0, altitude_m: 614.0, hora_utc: '11:21:15', satelites: 10, hdop: 0.9 },
      { latitude: -22.412460, longitude: -47.564070, velocidade_kmh: 0.0, altitude_m: 614.0, hora_utc: '11:22:00', satelites: 10, hdop: 0.9 }
    ]
  },
  {
    id: 2,
    client_id: 1,
    device_id: 'veiculo_001',
    name: 'Centro para Parque Lago Azul',
    origin_name: 'Centro de Rio Claro',
    destination_name: 'Parque Lago Azul',
    status: 'completed',
    start_time: '2026-08-18 14:30:00',
    end_time: '2026-08-18 14:41:00',
    total_distance_m: 3650.00,
    duration_seconds: 660,
    avg_speed_kmh: 33.2,
    max_speed_kmh: 47.0,
    points_count: 16,
    positions: [
      { latitude: -22.412450, longitude: -47.564050, velocidade_kmh: 0.0, altitude_m: 614.0, hora_utc: '17:30:00', satelites: 10, hdop: 0.9 },
      { latitude: -22.412350, longitude: -47.561500, velocidade_kmh: 24.0, altitude_m: 612.0, hora_utc: '17:30:45', satelites: 10, hdop: 0.9 },
      { latitude: -22.412200, longitude: -47.558500, velocidade_kmh: 30.0, altitude_m: 610.0, hora_utc: '17:31:30', satelites: 11, hdop: 0.8 },
      { latitude: -22.409500, longitude: -47.558100, velocidade_kmh: 38.0, altitude_m: 608.0, hora_utc: '17:32:15', satelites: 11, hdop: 0.8 },
      { latitude: -22.406200, longitude: -47.557600, velocidade_kmh: 42.0, altitude_m: 607.0, hora_utc: '17:33:00', satelites: 12, hdop: 0.8 },
      { latitude: -22.405200, longitude: -47.557400, velocidade_kmh: 35.0, altitude_m: 607.0, hora_utc: '17:33:45', satelites: 12, hdop: 0.8 },
      { latitude: -22.405000, longitude: -47.554200, velocidade_kmh: 44.0, altitude_m: 606.0, hora_utc: '17:34:30', satelites: 12, hdop: 0.8 },
      { latitude: -22.404800, longitude: -47.550100, velocidade_kmh: 47.0, altitude_m: 604.0, hora_utc: '17:35:15', satelites: 12, hdop: 0.8 },
      { latitude: -22.404600, longitude: -47.545800, velocidade_kmh: 46.0, altitude_m: 603.0, hora_utc: '17:36:00', satelites: 11, hdop: 0.8 },
      { latitude: -22.404400, longitude: -47.541500, velocidade_kmh: 43.0, altitude_m: 602.0, hora_utc: '17:36:45', satelites: 11, hdop: 0.8 },
      { latitude: -22.405100, longitude: -47.538500, velocidade_kmh: 36.0, altitude_m: 600.0, hora_utc: '17:37:30', satelites: 11, hdop: 0.8 },
      { latitude: -22.405700, longitude: -47.535800, velocidade_kmh: 30.0, altitude_m: 599.0, hora_utc: '17:38:15', satelites: 10, hdop: 0.9 },
      { latitude: -22.406100, longitude: -47.534200, velocidade_kmh: 22.0, altitude_m: 598.0, hora_utc: '17:39:00', satelites: 10, hdop: 0.9 },
      { latitude: -22.406500, longitude: -47.533400, velocidade_kmh: 15.0, altitude_m: 598.0, hora_utc: '17:39:45', satelites: 10, hdop: 0.9 },
      { latitude: -22.406600, longitude: -47.533200, velocidade_kmh: 4.0, altitude_m: 598.0, hora_utc: '17:40:30', satelites: 10, hdop: 0.9 },
      { latitude: -22.406620, longitude: -47.533180, velocidade_kmh: 0.0, altitude_m: 598.0, hora_utc: '17:41:00', satelites: 10, hdop: 0.9 }
    ]
  },
  {
    id: 3,
    client_id: 1,
    device_id: 'veiculo_001',
    name: 'Lago Azul para Shopping Rio Claro',
    origin_name: 'Lago Azul',
    destination_name: 'Shopping Rio Claro',
    status: 'completed',
    start_time: '2026-08-19 07:45:00',
    end_time: '2026-08-19 07:59:00',
    total_distance_m: 5840.00,
    duration_seconds: 840,
    avg_speed_kmh: 41.7,
    max_speed_kmh: 68.0,
    points_count: 18,
    positions: [
      { latitude: -22.406600, longitude: -47.533200, velocidade_kmh: 0.0, altitude_m: 598.0, hora_utc: '10:45:00', satelites: 11, hdop: 0.8 },
      { latitude: -22.406000, longitude: -47.534500, velocidade_kmh: 22.0, altitude_m: 598.0, hora_utc: '10:45:45', satelites: 11, hdop: 0.8 },
      { latitude: -22.405500, longitude: -47.537200, velocidade_kmh: 32.0, altitude_m: 599.0, hora_utc: '10:46:30', satelites: 11, hdop: 0.8 },
      { latitude: -22.404900, longitude: -47.541000, velocidade_kmh: 40.0, altitude_m: 601.0, hora_utc: '10:47:15', satelites: 12, hdop: 0.8 },
      { latitude: -22.404600, longitude: -47.545500, velocidade_kmh: 45.0, altitude_m: 603.0, hora_utc: '10:48:00', satelites: 12, hdop: 0.7 },
      { latitude: -22.404800, longitude: -47.550500, velocidade_kmh: 46.0, altitude_m: 604.0, hora_utc: '10:48:45', satelites: 12, hdop: 0.7 },
      { latitude: -22.405000, longitude: -47.554500, velocidade_kmh: 44.0, altitude_m: 606.0, hora_utc: '10:49:30', satelites: 12, hdop: 0.7 },
      { latitude: -22.405200, longitude: -47.557400, velocidade_kmh: 36.0, altitude_m: 607.0, hora_utc: '10:50:15', satelites: 12, hdop: 0.7 },
      { latitude: -22.408200, longitude: -47.557900, velocidade_kmh: 48.0, altitude_m: 608.0, hora_utc: '10:51:00', satelites: 12, hdop: 0.7 },
      { latitude: -22.412500, longitude: -47.558600, velocidade_kmh: 55.0, altitude_m: 610.0, hora_utc: '10:51:45', satelites: 12, hdop: 0.7 },
      { latitude: -22.417000, longitude: -47.559200, velocidade_kmh: 60.0, altitude_m: 612.0, hora_utc: '10:52:30', satelites: 12, hdop: 0.7 },
      { latitude: -22.421800, longitude: -47.560100, velocidade_kmh: 65.0, altitude_m: 614.0, hora_utc: '10:53:15', satelites: 11, hdop: 0.8 },
      { latitude: -22.426500, longitude: -47.561000, velocidade_kmh: 68.0, altitude_m: 615.0, hora_utc: '10:54:00', satelites: 11, hdop: 0.8 },
      { latitude: -22.431000, longitude: -47.561800, velocidade_kmh: 58.0, altitude_m: 616.0, hora_utc: '10:54:45', satelites: 11, hdop: 0.8 },
      { latitude: -22.434500, longitude: -47.562400, velocidade_kmh: 45.0, altitude_m: 617.0, hora_utc: '10:55:30', satelites: 10, hdop: 0.8 },
      { latitude: -22.436500, longitude: -47.562850, velocidade_kmh: 30.0, altitude_m: 618.0, hora_utc: '10:56:15', satelites: 10, hdop: 0.9 },
      { latitude: -22.437100, longitude: -47.562980, velocidade_kmh: 10.0, altitude_m: 618.0, hora_utc: '10:57:00', satelites: 10, hdop: 0.9 },
      { latitude: -22.437200, longitude: -47.563000, velocidade_kmh: 0.0, altitude_m: 618.0, hora_utc: '10:57:45', satelites: 10, hdop: 0.9 }
    ]
  }
];

let clientInfo = {
  id: localStorage.getItem('segcar_client_id') ? parseInt(localStorage.getItem('segcar_client_id'), 10) : 1,
  name: localStorage.getItem('segcar_client_name') || 'João Silva',
  vehicleModel: localStorage.getItem('segcar_vehicle_model') || 'Honda Civic Touring',
  plate: localStorage.getItem('segcar_vehicle_plate') || 'RCO-2026',
  phone: localStorage.getItem('segcar_client_phone') || '(19) 98765-4321',
};

function updateClientBadgeUI() {
  var nameEl = document.getElementById('client-name-display');
  var vehEl = document.getElementById('client-vehicle-display');
  var avatarEl = document.getElementById('sidebar-user-avatar');
  var titleEl = document.getElementById('trips-client-title');

  if (nameEl) nameEl.textContent = clientInfo.name;
  if (vehEl) vehEl.textContent = clientInfo.vehicleModel + ' (' + clientInfo.plate + ')';
  if (titleEl) titleEl.textContent = 'Rotas Gravadas (' + clientInfo.name + ')';
  
  var initials = 'JS';
  if (clientInfo.name) {
    var parts = clientInfo.name.trim().split(' ');
    initials = parts[0] ? parts[0][0].toUpperCase() : 'J';
    if (parts.length > 1 && parts[parts.length - 1]) {
      initials += parts[parts.length - 1][0].toUpperCase();
    }
    if (avatarEl) avatarEl.textContent = initials;
  }

  // Atualizar HUD do Mapa
  var hudPlate = document.getElementById('hud-plate-display');
  var hudModel = document.getElementById('hud-model-display');
  if (hudPlate) hudPlate.textContent = clientInfo.plate || 'RCO-2026';
  if (hudModel) hudModel.textContent = clientInfo.vehicleModel || 'Honda Civic';

  // Atualizar Tela de Minha Conta
  var accAvatar = document.getElementById('acc-avatar');
  var accName = document.getElementById('acc-name');
  var accPlate = document.getElementById('acc-plate');
  var accVeh = document.getElementById('acc-vehicle-model');
  var accPhone = document.getElementById('acc-phone');
  var accDev = document.getElementById('acc-device-id');

  if (accAvatar) accAvatar.textContent = initials;
  if (accName) accName.textContent = clientInfo.name;
  if (accPlate) accPlate.textContent = clientInfo.plate;
  if (accVeh) accVeh.textContent = clientInfo.vehicleModel;
  if (accPhone) accPhone.textContent = clientInfo.phone;
  if (accDev) accDev.textContent = config ? config.deviceId : 'veiculo_001';
}

let config = {
  url:        storedUrl,
  deviceId:   localStorage.getItem('segcar_device')     || 'veiculo_001',
  apiKey:     localStorage.getItem('segcar_apikey')     || 'troque-esta-chave-secreta',
  homeLat:    localStorage.getItem('segcar_home_lat')    ? parseFloat(localStorage.getItem('segcar_home_lat')) : -22.383120,
  homeLng:    localStorage.getItem('segcar_home_lng')    ? parseFloat(localStorage.getItem('segcar_home_lng')) : -47.551840,
  homeRadius: localStorage.getItem('segcar_home_radius') ? parseInt(localStorage.getItem('segcar_home_radius'), 10) : 50,
  tripStart:  localStorage.getItem('segcar_trip_start')  || null,
  mapTheme:   localStorage.getItem('segcar_map_theme')   || 'dark'
};

let marker            = null;
let homeMarker        = null;
let homeCircle        = null;
let polyline          = null;
let routeCoords       = [];
let routePointsMeta   = []; // metadados completos de cada ponto (velocidade, altitude, etc.)
let historyItems      = [];
let savedTrips        = [];
let fetchInterval     = null;
let lastData          = null;
let isRouteFrozen     = false;
let isDefiningHome    = false;
let mapTileLayer      = null;

// Route Inspection & Playback
let isViewingImported = false;
let importedPolyline  = null;
let importedStartMarker = null;
let importedEndMarker   = null;
let playbackMarker    = null;
let currentPlaybackPoints = [];
let playbackIndex     = 0;
let playbackTimer     = null;
let isPlaying         = false;
let playbackSpeedMult = 10;

/* ─── Auto-save: Detecção de Parada ─────────────────────────────── */
var STOPPED_THRESHOLD_KMH = 2;       // velocidade considera parado
var STOPPED_SAVE_MS       = 5 * 60 * 1000; // 5 minutos em ms
var stoppedSince          = null;    // timestamp de quando o veículo parou
var autoSaveTimer         = null;    // setTimeout para salvar
var tripStartTime         = null;    // ISO string de quando a viagem começou
var tripStartCoords       = null;    // [lat, lng] do ponto inicial
var isSavingTrip          = false;   // guard contra duplo-save
var recGlowInterval       = null;    // piscar do dot de gravação

/* ─── Map Init (Centro de Rio Claro - SP) ─────────────────────── */
const map = L.map('map', { zoomControl: true, attributionControl: true });

map.on('click', function(e) {
  if (isDefiningHome) {
    setHomeCoords(e.latlng.lat, e.latlng.lng);
  }
});

function applyMapTheme(theme) {
  if (mapTileLayer) {
    mapTileLayer.remove();
  }
  
  var urlPattern = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  
  mapTileLayer = L.tileLayer(urlPattern, {
    attribution: attribution,
    subdomains: 'abc',
    maxZoom: 19
  }).addTo(map);

  var tilePane = map.getPane('tilePane');
  if (tilePane) {
    if (theme === 'dark') {
      tilePane.classList.add('dark-tiles');
    } else {
      tilePane.classList.remove('dark-tiles');
    }
  }
}

function changeMapTheme() {
  var theme = document.getElementById('map-theme-select').value;
  config.mapTheme = theme;
  localStorage.setItem('segcar_map_theme', theme);
  applyMapTheme(theme);
}

applyMapTheme(config.mapTheme);

// Coordenadas iniciais centralizadas em Rio Claro - SP
map.setView([-22.4114, -47.5614], 13);

/* Custom vehicle marker */
const vehicleIcon = L.divIcon({
  className: '',
  html: '<div style="' +
    'width:32px;height:32px;' +
    'background:linear-gradient(135deg,#3b82f6,#60a5fa);' +
    'border-radius:50% 50% 50% 0;' +
    'transform:rotate(-45deg);' +
    'border:2px solid #fff;' +
    'box-shadow:0 0 14px rgba(59,130,246,0.8);' +
    '"></div>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

/* Custom playback vehicle marker (sem emoji, estilo pino de navegação) */
const playbackIcon = L.divIcon({
  className: '',
  html: '<div style="' +
    'width:34px;height:34px;' +
    'background:linear-gradient(135deg,#2563eb,#10b981);' +
    'border-radius:50% 50% 50% 0;' +
    'transform:rotate(-45deg);' +
    'border:2px solid #fff;' +
    'box-shadow:0 0 16px rgba(16,185,129,0.9);' +
    'display:flex;align-items:center;justify-content:center;' +
    '"><svg width="14" height="14" viewBox="0 0 24 24" fill="white" style="transform:rotate(45deg);"><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg></div>',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
});

/* Custom home marker */
const homeIcon = L.divIcon({
  className: '',
  html: '<div style="' +
    'width:30px;height:30px;' +
    'background:linear-gradient(135deg,#10b981,#059669);' +
    'border-radius:50% 50% 50% 0;' +
    'transform:rotate(-45deg);' +
    'border:2px solid #fff;' +
    'box-shadow:0 0 12px rgba(16,185,129,0.7);' +
    'display:flex;align-items:center;justify-content:center;' +
    '"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

/* ─── Config ─────────────────────────────────────────────────── */
function toggleConfig() {
  switchView('view-settings');

  var n = document.getElementById('cfg-client-name');
  if (n) {
    document.getElementById('cfg-client-name').value   = clientInfo.name;
    document.getElementById('cfg-vehicle-model').value = clientInfo.vehicleModel;
    document.getElementById('cfg-vehicle-plate').value = clientInfo.plate;
    document.getElementById('cfg-client-phone').value  = clientInfo.phone;

    document.getElementById('cfg-url').value    = config.url;
    document.getElementById('cfg-device').value = config.deviceId;
    document.getElementById('cfg-apikey').value = config.apiKey;
    document.getElementById('cfg-home-lat').value = config.homeLat !== null ? config.homeLat : '';
    document.getElementById('cfg-home-lng').value = config.homeLng !== null ? config.homeLng : '';
    document.getElementById('cfg-home-radius').value = config.homeRadius;
  }
}

function saveConfig() {
  // Salvar dados do Cliente & Veículo
  var clientName   = document.getElementById('cfg-client-name').value.trim()   || clientInfo.name;
  var vehicleModel = document.getElementById('cfg-vehicle-model').value.trim() || clientInfo.vehicleModel;
  var vehiclePlate = document.getElementById('cfg-vehicle-plate').value.trim() || clientInfo.plate;
  var clientPhone  = document.getElementById('cfg-client-phone').value.trim()  || clientInfo.phone;

  clientInfo.name         = clientName;
  clientInfo.vehicleModel = vehicleModel;
  clientInfo.plate        = vehiclePlate;
  clientInfo.phone        = clientPhone;

  localStorage.setItem('segcar_client_name', clientName);
  localStorage.setItem('segcar_vehicle_model', vehicleModel);
  localStorage.setItem('segcar_vehicle_plate', vehiclePlate);
  localStorage.setItem('segcar_client_phone', clientPhone);

  updateClientBadgeUI();

  // Enviar para a API MySQL para persistência no banco
  var apiUrl = buildApiUrl('/api/clients');
  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientInfo.id,
      name: clientName,
      vehicle_model: vehicleModel,
      plate: vehiclePlate,
      phone: clientPhone,
      device_id: config.deviceId
    })
  }).then(function(res) { return res.json(); })
    .then(function(data) {
      console.log('[SegCar] Cliente salvo no MySQL:', data);
    }).catch(function(err) {
      console.warn('[SegCar] Erro ao salvar cliente no MySQL:', err);
    });

  config.url      = document.getElementById('cfg-url').value.trim()    || config.url;
  config.deviceId = document.getElementById('cfg-device').value.trim() || config.deviceId;
  config.apiKey   = document.getElementById('cfg-apikey').value.trim() || config.apiKey;

  var homeLatVal = document.getElementById('cfg-home-lat').value.trim();
  var homeLngVal = document.getElementById('cfg-home-lng').value.trim();
  var homeRadVal = document.getElementById('cfg-home-radius').value.trim();

  config.homeLat = homeLatVal !== '' ? parseFloat(homeLatVal) : null;
  config.homeLng = homeLngVal !== '' ? parseFloat(homeLngVal) : null;
  config.homeRadius = homeRadVal !== '' ? parseInt(homeRadVal, 10) : 50;

  localStorage.setItem('segcar_url',    config.url);
  localStorage.setItem('segcar_device', config.deviceId);
  localStorage.setItem('segcar_apikey', config.apiKey);

  if (config.homeLat !== null) {
    localStorage.setItem('segcar_home_lat', config.homeLat.toString());
  } else {
    localStorage.removeItem('segcar_home_lat');
  }

  if (config.homeLng !== null) {
    localStorage.setItem('segcar_home_lng', config.homeLng.toString());
  } else {
    localStorage.removeItem('segcar_home_lng');
  }

  localStorage.setItem('segcar_home_radius', config.homeRadius.toString());

  updateHomeOnMap();
  
  if (lastData) {
    checkGeofence(lastData);
  }

  var cp = document.getElementById('config-panel');
  if (cp) cp.classList.remove('open');
  showToast('Configurações salvas com sucesso.', 'success');
  startPolling();
}

/* ─── Toast ──────────────────────────────────────────────────── */
var toastTimer = null;
function showToast(msg, type) {
  var el = document.getElementById('toast');
  el.textContent = msg;
  el.className   = type ? 'show ' + type : 'show';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { el.className = ''; }, 3000);
}

/* ─── Status Pill ────────────────────────────────────────────── */
var currentStatusRaw = { state: 'offline', text: 'Conectando...' };

function setStatus(state, text) {
  currentStatusRaw = { state: state, text: text };
  var pill = document.getElementById('status-pill');
  var txt  = document.getElementById('status-text');
  if (pill) {
    pill.className = 'status-pill ' + state;
    pill.setAttribute('title', 'Status: ' + text);
  }
  if (txt) {
    var isMobile = window.innerWidth <= 600;
    var displayText = text;
    if (isMobile) {
      if (text === 'Aguardando Rastreador') displayText = 'Aguardando';
      else if (text === 'Calibrando GPS...') displayText = 'Calibrando';
      else if (text === 'Conectando...') displayText = 'Conectando';
    }
    txt.textContent = displayText;
  }
}

/* ─── Flash animation helper ─────────────────────────────────── */
function flashEl(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('flashing');
  void el.offsetWidth;
  el.classList.add('flashing');
}

/* ─── Satellite dots ─────────────────────────────────────────── */
function updateSatDots(count) {
  var container = document.getElementById('sat-dots');
  if (!container) return;
  container.innerHTML = '';
  var max = 12;
  for (var i = 0; i < max; i++) {
    var d = document.createElement('div');
    d.className = 'sat-dot' + (i < count ? ' active' : '');
    container.appendChild(d);
  }
}

/* ─── HDOP quality helper (Muito Boa, Boa, Perdendo Sinal) ──────── */
function getHdopInfo(hdop) {
  if (hdop == null || hdop > 2.5) {
    return { label: 'Perdendo Sinal', cls: 'poor', pct: 25, desc: 'Sinal GPS instável ou buscando satélites' };
  }
  if (hdop <= 1.2) {
    return { label: 'Muito Boa', cls: 'excellent', pct: 95, desc: 'Precisão milimétrica estável para rastreamento em tempo real' };
  }
  return { label: 'Boa', cls: 'good', pct: 70, desc: 'Precisão de navegação adequada' };
}

function renderHdopStatus(hdop, isFix) {
  var qel = document.getElementById('hdop-quality');
  var qTextEl = document.getElementById('hdop-quality-text');
  var qDescEl = document.getElementById('hdop-quality-desc');
  var hdopBar = document.getElementById('hdop-bar');

  var info;
  if (!isFix) {
    info = { label: 'Perdendo Sinal', cls: 'poor', pct: 25, desc: 'Aguardando sincronização de sinal GPS' };
  } else {
    info = getHdopInfo(hdop);
  }

  if (qel) {
    qel.textContent = info.label;
    qel.className = 'hdop-quality ' + info.cls;
  }
  if (qTextEl) {
    qTextEl.textContent = info.label;
    qTextEl.className = 'kpi-number signal-quality-text ' + info.cls;
  }
  if (qDescEl) {
    qDescEl.textContent = info.desc;
  }
  if (hdopBar) {
    hdopBar.style.width = info.pct + '%';
    hdopBar.style.background =
      info.cls === 'excellent' ? 'var(--green)' :
      info.cls === 'good' ? 'var(--cyan)' : 'var(--red)';
  }
  var cardHdop = document.getElementById('card-hdop');
  if (cardHdop) cardHdop.classList.add('active');
}

/* ─── Update UI ──────────────────────────────────────────────── */
function updateUI(data, isLive) {
  isLive = !!isLive;
  var pos = data.position || data;
  lastData = pos;
  checkGeofence(pos);
  var banner = document.getElementById('calibration-banner');

  if (pos.status === 'aguardando_fix') {
    if (banner) banner.classList.add('active');
    document.getElementById('val-lat').textContent   = '–';
    document.getElementById('val-lng').textContent   = '–';
    document.getElementById('val-speed').textContent = '–';
    document.getElementById('val-alt').textContent   = '–';

    var valSatEl = document.getElementById('val-sat');
    if (valSatEl) valSatEl.textContent = pos.satelites != null ? pos.satelites : '–';
    if (typeof updateSatDots === 'function') updateSatDots(pos.satelites || 0);

    renderHdopStatus(pos.hdop, false);

    setStatus('online', 'Calibrando GPS...');
    return;
  }

  if (banner) banner.classList.remove('active');

  // Coordenadas
  document.getElementById('val-lat').textContent  = pos.latitude  != null ? pos.latitude.toFixed(6) : '–';
  document.getElementById('val-lng').textContent  = pos.longitude != null ? pos.longitude.toFixed(6) : '–';

  // Velocidade (Se não estiver transmitindo ao vivo agora, exibe 0.0 km/h)
  var spd = isLive ? (pos.velocidade_kmh != null ? pos.velocidade_kmh : 0) : 0;
  document.getElementById('val-speed').textContent = spd.toFixed(1);
  document.getElementById('speed-bar').style.width = Math.min(spd / 180 * 100, 100) + '%';
  flashEl('val-speed');

  // Altitude
  var alt = pos.altitude_m != null ? pos.altitude_m : null;
  document.getElementById('val-alt').textContent = alt !== null ? alt.toFixed(0) : '–';
  flashEl('val-alt');

  // Satélites (Guarded para caso esteja presente em outros elementos)
  var sat = pos.satelites != null ? pos.satelites : null;
  var valSat = document.getElementById('val-sat');
  if (valSat) valSat.textContent = sat !== null ? sat : '–';
  if (typeof updateSatDots === 'function') updateSatDots(sat || 0);

  // Qualidade do Sinal GPS (Muito Boa, Boa, Perdendo Sinal)
  renderHdopStatus(pos.hdop, isLive && pos.latitude != null);

  // Data / Hora
  document.getElementById('val-time').textContent = pos.hora_utc || (pos.received_at ? new Date(pos.received_at).toLocaleTimeString('pt-BR') : '–');
  document.getElementById('val-date').textContent = pos.data_utc || (pos.received_at ? new Date(pos.received_at).toLocaleDateString('pt-BR') : '–');

  // Dispositivo
  document.getElementById('val-device').textContent   = pos.device_id   || config.deviceId;
  document.getElementById('val-received').textContent = pos.received_at
    ? new Date(pos.received_at).toLocaleTimeString('pt-BR')
    : '–';
  // Atualizar HUD Flutuante no Mapa
  var liveSpeed = document.getElementById('val-speed-live');
  var liveSat = document.getElementById('val-sat-live');
  var liveAlt = document.getElementById('val-alt-live');
  var liveStatus = document.getElementById('hud-status-badge');

  if (liveSpeed) liveSpeed.textContent = spd.toFixed(0);
  if (liveSat) liveSat.textContent = sat !== null ? sat : '0';
  if (liveAlt) liveAlt.textContent = alt !== null ? alt.toFixed(0) : '0';
  if (liveStatus) liveStatus.textContent = isLive ? (spd > 3 ? 'EM MOVIMENTO' : 'ONLINE') : 'OFFLINE';

  var cardIds = ['card-speed', 'card-alt', 'card-hdop', 'card-time'];
  for (var c = 0; c < cardIds.length; c++) {
    var cardEl = document.getElementById(cardIds[c]);
    if (cardEl) cardEl.classList.add('active');
  }

  // Marcador no Mapa
  if (pos.latitude != null && pos.longitude != null) {
    var latlng = [pos.latitude, pos.longitude];

    if (!marker) {
      marker = L.marker(latlng, { icon: vehicleIcon });
      if (!isViewingImported) marker.addTo(map);
    } else {
      marker.setLatLng(latlng);
      if (!isViewingImported && !map.hasLayer(marker)) {
        marker.addTo(map);
      }
    }

    var statusDesc = isLive ? 'Em movimento (Ao Vivo)' : 'Estacionado (Última posição registrada)';
    marker.bindPopup(
      '<b>João Silva (Honda Civic)</b><br/>' +
      'Status: ' + statusDesc + '<br/>' +
      'Dispositivo: ' + (pos.device_id || config.deviceId) + '<br/>' +
      'Latitude: ' + pos.latitude + '<br/>Longitude: ' + pos.longitude + '<br/>' +
      'Velocidade: ' + spd.toFixed(1) + ' km/h<br/>' +
      'Altitude: ' + (alt !== null ? alt.toFixed(0) + ' m' : 'n/d') + '<br/>' +
      'Horário: ' + (pos.hora_utc || '–')
    );

    if (!isRouteFrozen && !isViewingImported && (routeCoords.length > 0 || (isLive && spd > 3))) {
      var isNewPoint = routeCoords.length === 0 ||
        routeCoords[routeCoords.length - 1][0] !== latlng[0] ||
        routeCoords[routeCoords.length - 1][1] !== latlng[1];

      if (isNewPoint) {
        routeCoords.push(latlng);

        // Armazena metadados do ponto para o auto-save
        routePointsMeta.push({
          latitude:      pos.latitude,
          longitude:     pos.longitude,
          velocidade_kmh: pos.velocidade_kmh != null ? pos.velocidade_kmh : 0,
          altitude_m:    pos.altitude_m != null ? pos.altitude_m : null,
          satelites:     pos.satelites != null ? pos.satelites : null,
          hdop:          pos.hdop != null ? pos.hdop : null,
          hora_utc:      pos.hora_utc || null,
          data_utc:      pos.data_utc || null,
          gps_timestamp_utc: pos.gps_timestamp_utc || null,
          received_at:   pos.received_at || new Date().toISOString()
        });

        // Registra início de viagem
        if (!tripStartTime) {
          tripStartTime  = new Date().toISOString();
          tripStartCoords = latlng;
          persistRouteToStorage();
        } else {
          persistRouteToStorage();
        }
      }

      // Motor de detecção de parada
      checkStopDetection(pos);

      if (!polyline) {
        polyline = L.polyline(routeCoords, {
          color: '#3b82f6',
          weight: 3,
          opacity: 0.8,
          dashArray: '8, 6',
        });
        polyline.addTo(map);
      } else {
        polyline.setLatLngs(routeCoords);
        if (!map.hasLayer(polyline)) polyline.addTo(map);
      }
    }

    if (!isViewingImported) {
      centerMap();
    }
  }
}

/* ─── Update History List ────────────────────────────────────── */
function updateHistory(items) {
  var list  = document.getElementById('history-list');
  var badge = document.getElementById('history-count');
  if (!list || !badge) return;

  badge.textContent = items.length;

  if (items.length === 0) {
    list.innerHTML = '<div class="no-data">' +
      '<div class="no-data-icon">🔍</div>' +
      '<div class="no-data-text">Nenhum registro no histórico.</div>' +
      '</div>';
    return;
  }

  list.innerHTML = '';
  for (var i = 0; i < items.length; i++) {
    (function(item) {
      var div = document.createElement('div');
      div.className = 'history-item';

      var time   = item.hora_utc || (item.received_at ? new Date(item.received_at).toLocaleTimeString('pt-BR') : '–');
      var coords = item.latitude != null && item.longitude != null
        ? item.latitude.toFixed(4) + ', ' + item.longitude.toFixed(4)
        : '–';
      var speed  = item.velocidade_kmh != null ? item.velocidade_kmh.toFixed(0) + ' km/h' : '–';

      div.innerHTML =
        '<span class="h-time">' + time + '</span>' +
        '<span class="h-coords">' + coords + '</span>' +
        '<span class="h-speed">' + speed + '</span>';

      if (item.latitude != null && item.longitude != null) {
        div.addEventListener('click', function() {
          map.flyTo([item.latitude, item.longitude], 16, { duration: 0.8 });
        });
      }

      list.appendChild(div);
    })(items[i]);
  }
}

/* ─── API Fetch ──────────────────────────────────────────────── */
function buildApiUrl(endpoint) {
  var base = (config.url || '').trim().replace(/\/+$/, '');
  
  // Se a URL estiver desatualizada (sem o caminho completo da API do XAMPP)
  if (!base || base.indexOf('sketch_jul12a') === -1 || base.indexOf(':8080') !== -1) {
    base = getDefaultApiUrl();
    config.url = base;
    localStorage.setItem('segcar_url', base);
    var cfgInput = document.getElementById('cfg-url');
    if (cfgInput) cfgInput.value = base;
  }
  
  if (base.indexOf('index.php') === -1) {
    base = base + '/index.php';
  }
  
  return base + endpoint;
}

function fetchLatest() {
  return new Promise(function(resolve) {
    var url = buildApiUrl('/api/latest?device_id=' + encodeURIComponent(config.deviceId));

    fetch(url, { signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined })
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(json) {
        if (json.status !== 'ok') throw new Error(json.message || 'Erro desconhecido');
        
        var isLive = json.is_live === true;
        if (isLive) {
          setStatus('online', 'Ao Vivo');
        } else {
          setStatus('offline', 'Aguardando Rastreador');
        }
        
        updateUI(json, isLive);
        resolve(true);
      })
      .catch(function(err) {
        setStatus('offline', 'Offline');
        console.warn('[SegCar] latest:', err.message);
        resolve(false);
      });
  });
}

function fetchHistory() {
  return new Promise(function(resolve) {
    var url = buildApiUrl('/api/history?device_id=' + encodeURIComponent(config.deviceId) + '&limit=100');

    fetch(url, { signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined })
      .then(function(res) {
        if (!res.ok) { resolve(); return; }
        return res.json();
      })
      .then(function(json) {
        if (json && json.status === 'ok') {
          historyItems = json.items || [];
          updateHistory(historyItems);
        }
        resolve();
      })
      .catch(function(err) {
        console.warn('[SegCar] history:', err.message);
        resolve();
      });
  });
}

function updateTripsCounters(trips) {
  var badge = document.getElementById('trips-db-count');
  var navBadge = document.getElementById('nav-trips-count');
  var totalKmEl = document.getElementById('trips-total-km');

  var count = trips ? trips.length : 0;
  if (badge) badge.textContent = count;
  if (navBadge) navBadge.textContent = count;

  if (totalKmEl && trips) {
    var totalM = 0;
    for (var i = 0; i < trips.length; i++) {
      totalM += (parseFloat(trips[i].total_distance_m) || 0);
    }
    totalKmEl.textContent = (totalM / 1000).toFixed(1) + ' km';
  }
}

function mergeWithSeedTrips(apiTrips) {
  var result = Array.isArray(apiTrips) ? apiTrips.slice() : [];
  for (var i = 0; i < SEED_TRIPS_DATA.length; i++) {
    var seed = SEED_TRIPS_DATA[i];
    var exists = result.some(function(t) {
      return t.name === seed.name || t.start_time === seed.start_time;
    });
    if (!exists) {
      if (seed.id === 100) {
        result.unshift(seed);
      } else {
        result.push(seed);
      }
    }
  }
  return result;
}

function fetchTripsFromDb() {
  return new Promise(function(resolve) {
    // Garante que a lista de rotas reais está sempre renderizada
    if (!savedTrips || savedTrips.length === 0) {
      savedTrips = SEED_TRIPS_DATA;
      renderDbTripsList(savedTrips);
      updateTripsCounters(savedTrips);
    }

    var url = buildApiUrl('/api/trips?device_id=' + encodeURIComponent(config.deviceId));

    fetch(url, { signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined })
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(json) {
        if (json && json.status === 'ok' && json.trips && json.trips.length > 0) {
          savedTrips = mergeWithSeedTrips(json.trips);
          renderDbTripsList(savedTrips);
          updateTripsCounters(savedTrips);
        }
        resolve();
      })
      .catch(function(err) {
        console.warn('[SegCar] trips API:', err.message);
        renderFallbackTrips();
        resolve();
      });
  });
}

function renderFallbackTrips() {
  savedTrips = SEED_TRIPS_DATA;
  renderDbTripsList(savedTrips);
  updateTripsCounters(savedTrips);
}

function renderDbTripsList(trips) {
  var container = document.getElementById('trips-list-container');
  if (!container) return;

  container.innerHTML = '';

  for (var i = 0; i < trips.length; i++) {
    (function(trip) {
      var card = document.createElement('div');
      card.className = 'trip-card';
      card.setAttribute('data-trip-id', trip.id);

      var distKm = (trip.total_distance_m / 1000).toFixed(2) + ' km';
      var durMin = Math.round(trip.duration_seconds / 60) + ' min';
      var avgSpd = trip.avg_speed_kmh.toFixed(1) + ' km/h';
      var maxSpd = trip.max_speed_kmh ? trip.max_speed_kmh.toFixed(1) + ' km/h' : '--';

      var dateFormatted = trip.start_time ? new Date(trip.start_time).toLocaleDateString('pt-BR', {day: '2-digit', month:'2-digit'}) : '';
      var timeFormatted = trip.start_time ? new Date(trip.start_time).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : '';

      card.innerHTML =
        '<div class="trip-header">' +
          '<span>' + trip.name + '</span>' +
          '<span style="font-size:0.68rem; font-weight:400; color:var(--text-3);">' + dateFormatted + ' às ' + timeFormatted + '</span>' +
        '</div>' +
        '<div class="trip-meta">' +
          '<span>Distância: ' + distKm + ' • Duração: ' + durMin + '</span>' +
          '<span>Méd: ' + avgSpd + ' | Máx: ' + maxSpd + '</span>' +
        '</div>' +
        '<div class="trip-actions">' +
          '<button class="trip-btn view-btn">Ver no Mapa</button>' +
          '<button class="trip-btn play-btn" style="background:rgba(59,130,246,0.15);border-color:rgba(59,130,246,0.3);color:var(--brand-primary);">Reproduzir</button>' +
          '<button class="trip-btn export export-btn">GPX</button>' +
        '</div>';

      var viewBtn = card.querySelector('.view-btn');
      viewBtn.addEventListener('click', function() {
        highlightActiveCard(card);
        loadAndDisplayTrip(trip, false);
      });

      var playBtn = card.querySelector('.play-btn');
      playBtn.addEventListener('click', function() {
        highlightActiveCard(card);
        loadAndDisplayTrip(trip, true);
      });

      var exportBtn = card.querySelector('.export-btn');
      exportBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        exportDbTripGPX(trip);
      });

      container.appendChild(card);
    })(trips[i]);
  }
}

function highlightActiveCard(activeCard) {
  var all = document.querySelectorAll('.trip-card');
  all.forEach(function(c) { c.classList.remove('active'); });
  if (activeCard) activeCard.classList.add('active');
}

function loadAndDisplayTrip(trip, autoPlay) {
  var seedMatch = SEED_TRIPS_DATA.find(function(s) { return s.id === trip.id || s.name === trip.name; });
  var url = buildApiUrl('/api/trips/positions?trip_id=' + trip.id);

  showToast('Carregando rota: ' + trip.name + '...', 'info');

  fetch(url)
    .then(function(res) { return res.json(); })
    .then(function(json) {
      if (json && json.status === 'ok' && json.positions && json.positions.length > 0) {
        applyTripPositions(trip, json.positions, autoPlay);
      } else if (trip.positions && trip.positions.length > 0) {
        applyTripPositions(trip, trip.positions, autoPlay);
      } else if (seedMatch && seedMatch.positions) {
        applyTripPositions(trip, seedMatch.positions, autoPlay);
      } else {
        showToast('Nenhum ponto encontrado para esta rota.', 'error');
      }
    })
    .catch(function(err) {
      console.warn('Fallback to seed positions:', err);
      if (trip.positions && trip.positions.length > 0) {
        applyTripPositions(trip, trip.positions, autoPlay);
      } else if (seedMatch && seedMatch.positions) {
        applyTripPositions(trip, seedMatch.positions, autoPlay);
      } else {
        showToast('Erro ao carregar pontos da rota.', 'error');
      }
    });
}

function applyTripPositions(trip, positions, autoPlay) {
  var coords = [];
  var times = [];
  var altitudes = [];

  for (var i = 0; i < positions.length; i++) {
    var p = positions[i];
    coords.push([p.latitude, p.longitude]);
    times.push(new Date(p.gps_timestamp_utc || p.received_at || '2026-08-18T10:00:00Z'));
    if (p.altitude_m != null) altitudes.push(p.altitude_m);
  }

  renderImportedRoute(coords, times, altitudes, {
    title: trip.name,
    distStr: (trip.total_distance_m / 1000).toFixed(2) + ' km',
    durationStr: Math.round(trip.duration_seconds / 60) + ' min',
    avgSpeedStr: trip.avg_speed_kmh.toFixed(1) + ' km/h',
    maxSpeedStr: trip.max_speed_kmh ? trip.max_speed_kmh.toFixed(1) + ' km/h' : '--',
    rawPoints: positions
  });

  // Alterna imediatamente para o Mapa Ao Vivo
  switchView('view-live');

  if (autoPlay) {
    setTimeout(function() { startPlayback(); }, 350);
  }
}

function exportDbTripGPX(trip) {
  var url = buildApiUrl('/api/trips/positions?trip_id=' + trip.id);

  fetch(url)
    .then(function(res) { return res.json(); })
    .then(function(json) {
      if (json && json.status === 'ok' && json.positions) {
        exportTripGPX(json.positions, trip.id, trip.name);
      }
    });
}

function fetchNow() {
  fetchLatest().then(function() {
    return fetchHistory();
  }).then(function() {
    return fetchTripsFromDb();
  });
}

/* ─── Map Controls ───────────────────────────────────────────── */
function centerMap() {
  if (marker) {
    map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 15), { duration: 0.8 });
  } else {
    map.flyTo([-22.4114, -47.5614], 14, { duration: 0.8 });
  }
}

function clearRoute() {
  routeCoords      = [];
  routePointsMeta  = [];
  tripStartTime    = null;
  tripStartCoords  = null;
  stoppedSince     = null;
  clearTimeout(autoSaveTimer);
  autoSaveTimer = null;
  isSavingTrip  = false;
  if (polyline) { polyline.remove(); polyline = null; }
  clearStoredRoute();
  updateRecordingIndicator(false);
  updateStopBadge(null);
  showToast('Rota limpa da tela.', '');
}

/* ─── Persistência do Trajeto no localStorage ────────────────────── */
function persistRouteToStorage() {
  try {
    var state = {
      routeCoords:     routeCoords,
      routePointsMeta: routePointsMeta,
      tripStartTime:   tripStartTime,
      tripStartCoords: tripStartCoords,
      savedAt:         new Date().toISOString()
    };
    localStorage.setItem('segcar_active_route', JSON.stringify(state));
  } catch(e) {
    console.warn('[SegCar] Falha ao persistir rota no localStorage:', e);
  }
}

function clearStoredRoute() {
  localStorage.removeItem('segcar_active_route');
}

function restoreRouteFromStorage() {
  // Limpa qualquer rota antiga de antes da finalização da viagem Rio Claro -> UNIP Limeira
  if (!localStorage.getItem('segcar_trip100_closed')) {
    clearStoredRoute();
    localStorage.setItem('segcar_trip100_closed', 'true');
    isRouteFrozen = true;
    return;
  }

  try {
    var raw = localStorage.getItem('segcar_active_route');
    if (!raw) return;
    var state = JSON.parse(raw);
    if (!state || !Array.isArray(state.routeCoords) || state.routeCoords.length === 0) return;

    // Verifica se a rota não está velha demais (mais de 12h = descarta)
    var savedAt = state.savedAt ? new Date(state.savedAt) : null;
    if (savedAt && (Date.now() - savedAt.getTime()) > 12 * 60 * 60 * 1000) {
      clearStoredRoute();
      return;
    }

    routeCoords      = state.routeCoords;
    routePointsMeta  = state.routePointsMeta  || [];
    tripStartTime    = state.tripStartTime    || null;
    tripStartCoords  = state.tripStartCoords  || null;

    // Redesenha a polyline
    if (routeCoords.length > 0 && !isViewingImported) {
      if (polyline) polyline.remove();
      polyline = L.polyline(routeCoords, {
        color: '#3b82f6',
        weight: 3,
        opacity: 0.8,
        dashArray: '8, 6'
      }).addTo(map);
      map.flyTo(routeCoords[routeCoords.length - 1], Math.max(map.getZoom(), 14), { duration: 0.8 });
    }

    updateRecordingIndicator(true);
    showToast('Trajeto anterior restaurado (' + routeCoords.length + ' pontos).', 'info');
  } catch(e) {
    console.warn('[SegCar] Falha ao restaurar rota do localStorage:', e);
  }
}

function finishCurrentTripManual() {
  if (routeCoords.length >= 2) {
    autoSaveCurrentTrip(true);
  } else {
    clearRoute();
    isRouteFrozen = true;
    fetchTripsFromDb().then(function() {
      showToast('Rota "Rio Claro para UNIP Limeira" encerrada e disponível em Viagens & Rotas!', 'success');
      switchView('view-trips');
    });
  }
}

/* ─── Motor de Detecção de Parada e Auto-Save ────────────────────── */
function checkStopDetection(pos) {
  var spd = pos.velocidade_kmh != null ? pos.velocidade_kmh : 0;

  if (spd <= STOPPED_THRESHOLD_KMH) {
    // Veículo está parado
    if (!stoppedSince) {
      stoppedSince = Date.now();
    }

    var stoppedMs = Date.now() - stoppedSince;
    var stoppedMin = Math.floor(stoppedMs / 60000);
    var stoppedSec = Math.floor((stoppedMs % 60000) / 1000);
    updateStopBadge(stoppedMin, stoppedSec, STOPPED_SAVE_MS);

    // Agenda o auto-save se ainda não agendado
    if (!autoSaveTimer && routeCoords.length >= 2 && !isSavingTrip) {
      var remaining = STOPPED_SAVE_MS - stoppedMs;
      if (remaining <= 0) {
        autoSaveCurrentTrip();
      } else {
        autoSaveTimer = setTimeout(function() {
          autoSaveCurrentTrip();
        }, remaining);
      }
    }
  } else {
    // Veículo em movimento — cancela timer de parada
    if (stoppedSince) {
      stoppedSince  = null;
      clearTimeout(autoSaveTimer);
      autoSaveTimer = null;
      updateStopBadge(null);
    }
  }

  // Atualiza indicador de gravação se houver pontos
  if (routeCoords.length > 0) {
    updateRecordingIndicator(true);
  }
}

function autoSaveCurrentTrip(isManual) {
  if (isSavingTrip) return;
  if (routeCoords.length < 2) {
    clearRoute();
    return;
  }

  isSavingTrip  = true;
  autoSaveTimer = null;

  showToast(isManual ? 'Encerrando e salvando rota...' : 'Veículo parado 5 min — salvando trajeto automaticamente...', 'info');

  // Calcular métricas
  var now      = new Date();
  var startDt  = tripStartTime ? new Date(tripStartTime) : now;
  var durationSecs = Math.round((now.getTime() - startDt.getTime()) / 1000);

  var totalDistM = 0;
  for (var i = 0; i < routeCoords.length - 1; i++) {
    totalDistM += getDistanceMeters(
      routeCoords[i][0], routeCoords[i][1],
      routeCoords[i+1][0], routeCoords[i+1][1]
    );
  }

  var speeds = routePointsMeta
    .map(function(p) { return p.velocidade_kmh || 0; })
    .filter(function(s) { return s > 0; });
  var maxSpeed = speeds.length > 0 ? Math.max.apply(null, speeds) : 0;
  var avgSpeed = speeds.length > 0
    ? speeds.reduce(function(a, b) { return a + b; }, 0) / speeds.length
    : 0;

  // Nome automático baseado na hora de início
  var tripName = 'Viagem ' + startDt.toLocaleDateString('pt-BR') +
    ' às ' + startDt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  var payload = {
    device_id:        config.deviceId,
    client_id:        clientInfo.id,
    name:             tripName,
    origin_name:      null,
    destination_name: null,
    start_time:       startDt.toISOString().slice(0, 19).replace('T', ' '),
    end_time:         now.toISOString().slice(0, 19).replace('T', ' '),
    total_distance_m: Math.round(totalDistM),
    duration_seconds: durationSecs,
    avg_speed_kmh:    Math.round(avgSpeed * 10) / 10,
    max_speed_kmh:    Math.round(maxSpeed * 10) / 10,
    positions:        routePointsMeta
  };

  var url = buildApiUrl('/api/trips');
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    if (data && data.status === 'ok') {
      showToast('Rota "' + tripName + '" encerrada e salva com sucesso!', 'success');
      // Limpa o trajeto atual, pausa gravação parado e recarrega a lista de rotas
      clearRoute();
      isRouteFrozen = true;
      fetchTripsFromDb();
      if (isManual) {
        switchView('view-trips');
      }
    } else {
      showToast('Erro ao salvar rota: ' + (data.message || 'desconhecido'), 'error');
      isSavingTrip = false;
    }
  })
  .catch(function(err) {
    console.error('[SegCar] Erro no auto-save:', err);
    showToast('Falha de rede ao salvar rota.', 'error');
    isSavingTrip = false;
  });
}

/* ─── Indicadores visuais de gravação ───────────────────────────── */
function updateRecordingIndicator(isRecording) {
  var recBox = document.getElementById('rec-indicator');
  var dot = document.getElementById('rec-dot');
  var label = document.getElementById('rec-label');
  var btnFinish = document.getElementById('btn-finish-route');
  if (!dot || !label) return;

  if (isRecording && routeCoords.length > 0 && !isViewingImported) {
    if (recBox) recBox.style.display = 'flex';
    dot.style.display = 'inline-block';
    label.textContent = 'Gravando (' + routeCoords.length + ' pts)';
    if (btnFinish) btnFinish.style.display = 'inline-block';
  } else {
    if (recBox) recBox.style.display = 'none';
    dot.style.display = 'none';
    label.textContent = '';
    if (btnFinish) btnFinish.style.display = 'none';
  }
}

function updateStopBadge(stoppedMin, stoppedSec, totalMs) {
  var badge = document.getElementById('stop-countdown-badge');
  if (!badge) return;

  if (stoppedMin === null) {
    badge.style.display = 'none';
    badge.textContent   = '';
    return;
  }

  var remainingSecs = Math.max(0, Math.round((totalMs - (stoppedMin * 60000 + stoppedSec * 1000)) / 1000));
  var remainMin = Math.floor(remainingSecs / 60);
  var remainSec = remainingSecs % 60;

  badge.style.display = 'inline-flex';
  if (remainingSecs <= 0) {
    badge.textContent = 'Salvando rota...';
    badge.style.background = 'rgba(16, 185, 129, 0.25)';
    badge.style.color = '#a7f3d0';
  } else {
    badge.textContent = 'Parado ' + stoppedMin + 'm' + (stoppedSec < 10 ? '0' : '') + stoppedSec + 's' +
      ' — salva em ' + remainMin + ':' + (remainSec < 10 ? '0' : '') + remainSec;
    badge.style.background = 'rgba(245, 158, 11, 0.2)';
    badge.style.color = '#fcd34d';
  }
}

/* ─── Polling ────────────────────────────────────────────────── */
function startPolling() {
  clearInterval(fetchInterval);
  fetchNow();

  var interval = parseInt(document.getElementById('interval-select').value, 10);
  fetchInterval = setInterval(fetchNow, interval);
}

document.getElementById('interval-select').addEventListener('change', startPolling);

/* ─── Init ───────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', function() {
  // Mostrar botão do administrador se for admin
  var isAdmin = localStorage.getItem('segcar_is_admin') === 'true';
  var adminBtn = document.getElementById('admin-btn');
  var adminLink = document.getElementById('admin-portal-link');
  var adminSidebarSec = document.getElementById('sidebar-admin-section');

  if (adminBtn) adminBtn.style.display = isAdmin ? 'inline-flex' : 'none';
  if (adminLink) adminLink.style.display = isAdmin ? 'inline-flex' : 'none';
  if (adminSidebarSec) adminSidebarSec.style.display = isAdmin ? 'block' : 'none';

  // Renderiza dados do cliente e suas rotas
  updateClientBadgeUI();
  
  var nameInput = document.getElementById('cfg-client-name');
  var vehInput = document.getElementById('cfg-vehicle-model');
  var plateInput = document.getElementById('cfg-vehicle-plate');
  var phoneInput = document.getElementById('cfg-client-phone');
  if (nameInput) nameInput.value = clientInfo.name;
  if (vehInput) vehInput.value = clientInfo.vehicleModel;
  if (plateInput) plateInput.value = clientInfo.plate;
  if (phoneInput) phoneInput.value = clientInfo.phone;

  savedTrips = SEED_TRIPS_DATA;
  renderDbTripsList(savedTrips);
  updateTripsCounters(savedTrips);

  document.getElementById('cfg-url').value    = config.url;
  document.getElementById('cfg-device').value = config.deviceId;
  document.getElementById('cfg-apikey').value = config.apiKey;
  document.getElementById('map-theme-select').value = config.mapTheme;

  if (config.homeLat !== null) document.getElementById('cfg-home-lat').value = config.homeLat.toFixed(6);
  if (config.homeLng !== null) document.getElementById('cfg-home-lng').value = config.homeLng.toFixed(6);
  document.getElementById('cfg-home-radius').value = config.homeRadius;

  updateHomeOnMap();
  restoreRouteFromStorage();
  startPolling();
});

/* ─── Geofence & Home Helpers ────────────────────────────────── */
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  var R = 6371000;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function checkGeofence(pos) {
  if (config.homeLat === null || config.homeLng === null || pos.latitude == null || pos.longitude == null) {
    var hb = document.getElementById('home-banner');
    if (hb) hb.classList.remove('active');
    isRouteFrozen = false;
    return;
  }
  
  var dist = getDistanceMeters(pos.latitude, pos.longitude, config.homeLat, config.homeLng);
  var banner = document.getElementById('home-banner');
  var details = document.getElementById('home-detail');
  
  if (dist <= config.homeRadius) {
    if (!isRouteFrozen) {
      isRouteFrozen = true;
      showToast('Veículo entrou na cerca de casa (Rio Claro). Gravação pausada.', 'info');
    }
    if (banner) banner.classList.add('active');
    if (details) details.textContent = 'Veículo está a ' + dist.toFixed(0) + 'm de Casa (Jd. Floridiana). Rota congelada.';
  } else {
    if (isRouteFrozen) {
      isRouteFrozen = false;
      showToast('Veículo saiu da cerca de casa. Retomando gravação.', 'info');
    }
    if (banner) banner.classList.remove('active');
  }
}

function startDefineHomeMap() {
  isDefiningHome = true;
  switchView('view-live');
  var mapEl = document.getElementById('map');
  if (mapEl) mapEl.style.cursor = 'crosshair';
  showToast('Clique no mapa de Rio Claro para marcar a localização de casa.', 'info');
}

function setHomeHere() {
  if (lastData && lastData.latitude != null && lastData.longitude != null) {
    setHomeCoords(lastData.latitude, lastData.longitude);
  } else {
    showToast('Nenhuma posição do veículo recebida ainda.', 'error');
  }
}

function setHomeCoords(lat, lng) {
  config.homeLat = lat;
  config.homeLng = lng;
  localStorage.setItem('segcar_home_lat', lat.toString());
  localStorage.setItem('segcar_home_lng', lng.toString());
  
  document.getElementById('cfg-home-lat').value = lat.toFixed(6);
  document.getElementById('cfg-home-lng').value = lng.toFixed(6);
  
  updateHomeOnMap();
  isDefiningHome = false;
  document.getElementById('map').style.cursor = '';
  
  showToast('Localização de casa atualizada.', 'success');
  
  if (lastData) {
    checkGeofence(lastData);
  }
}

function updateHomeOnMap() {
  if (homeMarker) { homeMarker.remove(); homeMarker = null; }
  if (homeCircle) { homeCircle.remove(); homeCircle = null; }
  
  if (config.homeLat !== null && config.homeLng !== null) {
    homeMarker = L.marker([config.homeLat, config.homeLng], { icon: homeIcon }).addTo(map);
    homeMarker.bindPopup('<b>Casa do João (Jd. Floridiana)</b><br/>Área de cerca virtual.');
    
    homeCircle = L.circle([config.homeLat, config.homeLng], {
      color: '#10b981',
      fillColor: '#10b981',
      fillOpacity: 0.12,
      radius: config.homeRadius,
      weight: 1.5,
      dashArray: '4, 4'
    }).addTo(map);
  }
}

/* ─── GPX & Route Rendering ──────────────────────────────────── */
function exportTripGPX(points, tripId, tripName) {
  if (!points || points.length === 0) return;
  
  var name = tripName || ('Viagem ' + tripId);
  var gpxXml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<gpx version="1.1" creator="SegCar Dashboard" xmlns="http://www.topografix.com/GPX/1/1">\n' +
    '  <metadata>\n' +
    '    <name>' + name + ' - João Silva (' + config.deviceId + ')</name>\n' +
    '    <time>' + new Date().toISOString() + '</time>\n' +
    '  </metadata>\n' +
    '  <trk>\n' +
    '    <name>' + name + '</name>\n' +
    '    <trkseg>\n';

  for (var i = 0; i < points.length; i++) {
    var pt = points[i];
    if (pt.latitude != null && pt.longitude != null) {
      gpxXml += '      <trkpt lat="' + pt.latitude + '" lon="' + pt.longitude + '">\n';
      if (pt.altitude_m != null) {
        gpxXml += '        <ele>' + pt.altitude_m + '</ele>\n';
      }
      var isoTime = pt.gps_timestamp_utc || pt.received_at || new Date().toISOString();
      gpxXml += '        <time>' + isoTime + '</time>\n';
      gpxXml += '      </trkpt>\n';
    }
  }

  gpxXml += '    </trkseg>\n  </trk>\n</gpx>';

  var blob = new Blob([gpxXml], { type: 'application/gpx+xml;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var link = document.createElement('a');
  link.href = url;
  
  var dateStr = new Date().toISOString().slice(0, 10);
  link.download = 'segcar_rota_joao_' + (tripId || 'custom') + '_' + dateStr + '.gpx';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast('Rota GPX exportada com sucesso.', 'success');
}

function handleGPXSelect(event) {
  var file = event.target.files[0];
  if (!file) return;
  
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var content = e.target.result;
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(content, "text/xml");
      var trackPoints = xmlDoc.getElementsByTagName("trkpt");
      
      if (trackPoints.length === 0) {
        showToast("Nenhum ponto de rota válido no arquivo GPX.", "error");
        return;
      }
      
      var coords = [];
      var times = [];
      var altitudes = [];
      var rawPoints = [];
      
      for (var i = 0; i < trackPoints.length; i++) {
        var pt = trackPoints[i];
        var lat = parseFloat(pt.getAttribute("lat"));
        var lon = parseFloat(pt.getAttribute("lon"));
        
        var eleNode = pt.getElementsByTagName("ele")[0];
        var ele = eleNode ? parseFloat(eleNode.textContent) : null;
        
        var timeNode = pt.getElementsByTagName("time")[0];
        var time = timeNode ? new Date(timeNode.textContent) : null;
        
        if (!isNaN(lat) && !isNaN(lon)) {
          coords.push([lat, lon]);
          if (ele !== null && !isNaN(ele)) altitudes.push(ele);
          if (time && !isNaN(time.getTime())) times.push(time);

          rawPoints.push({
            latitude: lat,
            longitude: lon,
            altitude_m: ele,
            gps_timestamp_utc: time ? time.toISOString() : null,
            velocidade_kmh: 0
          });
        }
      }
      
      if (coords.length === 0) {
        showToast("Erro ao ler coordenadas do arquivo.", "error");
        return;
      }
      
      renderImportedRoute(coords, times, altitudes, {
        title: 'Arquivo GPX Externo',
        rawPoints: rawPoints
      });
      
    } catch (err) {
      console.error(err);
      showToast("Erro ao processar o arquivo GPX.", "error");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function renderImportedRoute(coords, times, altitudes, meta) {
  isViewingImported = true;
  stopPlayback();
  updateRecordingIndicator(false);

  var mapContainer = document.getElementById('map-container');
  if (mapContainer) mapContainer.classList.add('playback-active');
  
  removeImportedElements();
  
  if (polyline) polyline.remove();
  if (marker) marker.remove();
  if (homeMarker) homeMarker.remove();
  if (homeCircle) homeCircle.remove();
  
  importedPolyline = L.polyline(coords, {
    color: '#3b82f6',
    weight: 4,
    opacity: 0.95
  }).addTo(map);
  
  var startPoint = coords[0];
  var endPoint = coords[coords.length - 1];
  
  var startIcon = L.divIcon({
    className: '',
    html: '<div style="width:14px;height:14px;background:#10b981;border:2px solid #fff;border-radius:50%;box-shadow:0 0 10px #10b981;"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
  
  var endIcon = L.divIcon({
    className: '',
    html: '<div style="width:14px;height:14px;background:#ef4444;border:2px solid #fff;border-radius:50%;box-shadow:0 0 10px #ef4444;"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
  
  importedStartMarker = L.marker(startPoint, { icon: startIcon }).addTo(map)
    .bindPopup('<b>Partida:</b> ' + (meta && meta.title ? meta.title : 'Início'));
    
  importedEndMarker = L.marker(endPoint, { icon: endIcon }).addTo(map)
    .bindPopup('<b>Chegada / Destino</b>');
  
  map.fitBounds(importedPolyline.getBounds(), { padding: [40, 40] });
  
  // Distância
  var distStr = meta && meta.distStr;
  if (!distStr) {
    var totalDist = 0;
    for (var i = 0; i < coords.length - 1; i++) {
      totalDist += getDistanceMeters(coords[i][0], coords[i][1], coords[i+1][0], coords[i+1][1]);
    }
    distStr = totalDist >= 1000 
      ? (totalDist / 1000).toFixed(2) + ' km' 
      : totalDist.toFixed(0) + ' m';
  }
  
  // Duração e Velocidade Média
  var durationStr = meta && meta.durationStr ? meta.durationStr : "N/D";
  var avgSpeedStr = meta && meta.avgSpeedStr ? meta.avgSpeedStr : "N/D";
  var maxSpeedStr = meta && meta.maxSpeedStr ? meta.maxSpeedStr : "N/D";
  
  if (durationStr === "N/D" && times && times.length >= 2) {
    var diffMs = times[times.length - 1].getTime() - times[0].getTime();
    var diffSecs = Math.floor(diffMs / 1000);
    var hrs = Math.floor(diffSecs / 3600);
    var mins = Math.floor((diffSecs % 3600) / 60);
    var secs = diffSecs % 60;
    
    durationStr = "";
    if (hrs > 0) durationStr += hrs + "h ";
    if (mins > 0 || hrs > 0) durationStr += mins + "m ";
    durationStr += secs + "s";
  }

  // Preencher Raw points para o Playback
  currentPlaybackPoints = meta && meta.rawPoints ? meta.rawPoints : coords.map(function(c) {
    return { latitude: c[0], longitude: c[1], velocidade_kmh: 35, altitude_m: 610 };
  });

  // Ajusta velocidade padrão automaticamente conforme a quantidade de pontos da rota
  var selSpeed = document.getElementById('playback-speed-select');
  if (currentPlaybackPoints.length > 300) {
    playbackSpeedMult = 25;
    if (selSpeed) selSpeed.value = '25';
  } else {
    playbackSpeedMult = 10;
    if (selSpeed) selSpeed.value = '10';
  }

  document.getElementById('route-analysis-title').textContent = meta && meta.title ? meta.title : 'Análise de Rota';
  document.getElementById('import-dist').textContent = distStr;
  document.getElementById('import-duration').textContent = durationStr;
  document.getElementById('import-avg-speed').textContent = avgSpeedStr;
  document.getElementById('import-max-speed').textContent = maxSpeedStr;
  
  document.getElementById('import-banner-section').style.display = 'block';
  showToast("Rota carregada com sucesso.", "success");
}

function removeImportedElements() {
  if (importedPolyline) { importedPolyline.remove(); importedPolyline = null; }
  if (importedStartMarker) { importedStartMarker.remove(); importedStartMarker = null; }
  if (importedEndMarker) { importedEndMarker.remove(); importedEndMarker = null; }
  if (playbackMarker) { playbackMarker.remove(); playbackMarker = null; }
}

function clearImportedRoute() {
  isViewingImported = false;
  stopPlayback();

  var mapContainer = document.getElementById('map-container');
  if (mapContainer) mapContainer.classList.remove('playback-active');
  updateRecordingIndicator(routeCoords.length > 0);
  
  removeImportedElements();
  document.getElementById('import-banner-section').style.display = 'none';
  
  var allCards = document.querySelectorAll('.trip-card');
  allCards.forEach(function(c) { c.classList.remove('active'); });

  updateHomeOnMap();
  
  if (polyline && routeCoords.length > 0) {
    polyline.addTo(map);
  }
  
  if (marker && lastData && lastData.latitude != null) {
    var latlng = [lastData.latitude, lastData.longitude];
    marker.setLatLng(latlng).addTo(map);
    centerMap();
  }
  
  showToast("Retornado ao monitoramento em tempo real.", "info");
}

/* ─── Playback Engine (Simulador / Replay da Rota) ─────────────── */
function togglePlayback() {
  if (isPlaying) {
    pausePlayback();
  } else {
    startPlayback();
  }
}

function startPlayback() {
  if (!currentPlaybackPoints || currentPlaybackPoints.length === 0) {
    showToast('Nenhum ponto para reproduzir.', 'error');
    return;
  }

  if (playbackIndex >= currentPlaybackPoints.length) {
    playbackIndex = 0;
  }

  isPlaying = true;
  document.getElementById('btn-playback-toggle').textContent = 'Pausar';
  var badge = document.getElementById('playback-status-badge');
  if (badge) {
    badge.textContent = 'Reproduzindo';
    badge.className = 'playback-badge playing';
  }

  runPlaybackStep();
}

function pausePlayback() {
  isPlaying = false;
  clearTimeout(playbackTimer);
  document.getElementById('btn-playback-toggle').textContent = 'Continuar';
  var badge = document.getElementById('playback-status-badge');
  if (badge) {
    badge.textContent = 'Pausado';
    badge.className = 'playback-badge';
  }
}

function stopPlayback() {
  isPlaying = false;
  clearTimeout(playbackTimer);
  playbackIndex = 0;

  var toggleBtn = document.getElementById('btn-playback-toggle');
  if (toggleBtn) toggleBtn.textContent = 'Iniciar';

  var badge = document.getElementById('playback-status-badge');
  if (badge) {
    badge.textContent = 'Pronto';
    badge.className = 'playback-badge';
  }

  var bar = document.getElementById('playback-progress-bar');
  if (bar) bar.style.width = '0%';

  if (playbackMarker) {
    playbackMarker.remove();
    playbackMarker = null;
  }
}

function changePlaybackSpeed() {
  var sel = document.getElementById('playback-speed-select');
  if (sel) {
    playbackSpeedMult = parseFloat(sel.value) || 10;
  }
}

function seekPlayback(event) {
  if (!currentPlaybackPoints || currentPlaybackPoints.length === 0) return;
  var wrap = event.currentTarget;
  var rect = wrap.getBoundingClientRect();
  var clickX = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
  var ratio = rect.width > 0 ? (clickX / rect.width) : 0;
  playbackIndex = Math.min(
    currentPlaybackPoints.length - 1,
    Math.max(0, Math.round(ratio * (currentPlaybackPoints.length - 1)))
  );
  renderPlaybackPointAt(playbackIndex);
}

function renderPlaybackPointAt(idx) {
  if (!currentPlaybackPoints || idx < 0 || idx >= currentPlaybackPoints.length) return;
  var pt = currentPlaybackPoints[idx];
  var latlng = [pt.latitude, pt.longitude];

  if (!playbackMarker) {
    playbackMarker = L.marker(latlng, { icon: playbackIcon, zIndexOffset: 1000 }).addTo(map);
  } else {
    playbackMarker.setLatLng(latlng);
  }

  var spd = pt.velocidade_kmh != null ? parseFloat(pt.velocidade_kmh) : 0;
  var alt = pt.altitude_m != null ? parseFloat(pt.altitude_m) : null;

  // Atualizar cards de telemetria e HUD flutuante no Mapa Ao Vivo
  document.getElementById('val-lat').textContent = pt.latitude.toFixed(6);
  document.getElementById('val-lng').textContent = pt.longitude.toFixed(6);
  document.getElementById('val-speed').textContent = spd.toFixed(1);
  document.getElementById('speed-bar').style.width = Math.min(spd / 180 * 100, 100) + '%';

  var liveSpeed = document.getElementById('val-speed-live');
  var liveAlt = document.getElementById('val-alt-live');
  var liveStatus = document.getElementById('hud-status-badge');
  if (liveSpeed) liveSpeed.textContent = spd.toFixed(0);
  if (liveAlt && alt !== null) liveAlt.textContent = alt.toFixed(0);
  if (liveStatus) liveStatus.textContent = 'REPLAY (' + playbackSpeedMult + 'x)';

  if (alt !== null) {
    document.getElementById('val-alt').textContent = alt.toFixed(0);
  }
  if (pt.hora_utc) {
    document.getElementById('val-time').textContent = pt.hora_utc;
  }

  var badge = document.getElementById('playback-status-badge');
  if (badge && isPlaying) {
    badge.textContent = (idx + 1) + '/' + currentPlaybackPoints.length + ' pts • ' + spd.toFixed(0) + ' km/h';
  }

  // Progresso
  var total = Math.max(1, currentPlaybackPoints.length - 1);
  var pct = Math.round((idx / total) * 100);
  var pBar = document.getElementById('playback-progress-bar');
  if (pBar) pBar.style.width = pct + '%';
}

function runPlaybackStep() {
  if (!isPlaying) return;

  var totalPts = currentPlaybackPoints.length;
  if (playbackIndex >= totalPts) {
    showToast('Reprodução da rota concluída!', 'success');
    stopPlayback();
    return;
  }

  renderPlaybackPointAt(playbackIndex);

  if (playbackIndex >= totalPts - 1) {
    playbackIndex = totalPts;
    playbackTimer = setTimeout(runPlaybackStep, 150);
    return;
  }

  // Sem trava de 250ms: permite atualização fluida em até 40fps (25ms) e salto adaptativo em altas velocidades
  var idealDelayMs = 400 / playbackSpeedMult;
  var stepDelay = Math.max(25, Math.round(idealDelayMs));
  var stepAdvance = idealDelayMs < 25 ? Math.max(1, Math.round(25 / idealDelayMs)) : 1;

  // Se a rota tiver muitos pontos (> 300), acelera proporcionalmente para não demorar minutos
  if (totalPts > 300) {
    var densityFactor = Math.max(1, Math.round((totalPts / 300) * (playbackSpeedMult / 10)));
    stepAdvance = Math.max(stepAdvance, densityFactor);
  }

  playbackIndex = Math.min(totalPts - 1, playbackIndex + stepAdvance);
  playbackTimer = setTimeout(runPlaybackStep, stepDelay);
}

function handleLogout() {
  localStorage.removeItem('segcar_client_id');
  localStorage.removeItem('segcar_client_name');
  localStorage.removeItem('segcar_vehicle_model');
  localStorage.removeItem('segcar_vehicle_plate');
  localStorage.removeItem('segcar_client_phone');
  localStorage.removeItem('segcar_device');
  localStorage.removeItem('segcar_apikey');
  localStorage.removeItem('segcar_is_admin');
  window.location.href = 'login.html';
}

function toggleAdminPanel() {
  var modal = document.getElementById('admin-modal');
  if (!modal) return;
  
  if (modal.style.display === 'none') {
    modal.style.display = 'flex';
    loadAdminClients();
  } else {
    modal.style.display = 'none';
  }
}

function loadAdminClients() {
  var tbody = document.getElementById('admin-clients-table-body');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" style="padding:1.5rem; text-align:center; color:var(--text-muted);">Carregando listagem de clientes e veículos...</td></tr>';

  var url = buildApiUrl('/api/clients');
  fetch(url)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data && data.status === 'ok' && data.clients) {
        tbody.innerHTML = '';
        data.clients.forEach(function(c) {
          var tr = document.createElement('tr');
          tr.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
          
          var clientName = c.name + (c.is_admin ? ' <span style="background: rgba(6, 182, 212, 0.15); color: #22d3ee; padding: 0.1rem 0.4rem; font-size: 0.75rem; border-radius: 4px; font-weight: 700; margin-left: 0.25rem;">Admin</span>' : '');
          var email = c.email || 'n/d';
          var phone = c.phone || 'n/d';
          var model = c.vehicle_model || 'Não cadastrado';
          var plate = c.plate || 'n/d';
          var deviceId = c.device_id || 'n/d';

          // Ações
          var actionsHtml = '<div style="display:flex; gap:0.5rem; justify-content:center;">';
          if (c.device_id) {
            actionsHtml += '<button onclick="viewClientTrack(\'' + c.device_id + '\', \'' + (c.vehicle_model || 'Carro').replace(/'/g, "\\'") + '\', \'' + plate + '\', \'' + c.name.replace(/'/g, "\\'") + '\')" style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #a7f3d0; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.8rem; cursor: pointer;">Monitorar</button>';
          }
          if (c.id > 2) { // Não permite excluir João Silva (1) ou o Administrador Base (2)
            actionsHtml += '<button onclick="deleteClient(' + c.id + ')" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.8rem; cursor: pointer;">Excluir</button>';
          } else {
            actionsHtml += '<span style="color:var(--text-muted); font-size:0.8rem; padding:0.3rem;">Sistema</span>';
          }
          actionsHtml += '</div>';

          tr.innerHTML = 
            '<td style="padding:1rem; color:#fff; font-weight:600;">' + clientName + '</td>' +
            '<td style="padding:1rem; color:var(--text-muted);">' + email + '<br><small>' + phone + '</small></td>' +
            '<td style="padding:1rem; color:#fff;">' + model + '</td>' +
            '<td style="padding:1rem; color:#fff; font-family:\'JetBrains Mono\', monospace;">' + plate + '</td>' +
            '<td style="padding:1rem; color:var(--text-muted); font-family:\'JetBrains Mono\', monospace;">' + deviceId + '</td>' +
            '<td style="padding:1rem;">' + actionsHtml + '</td>';
          
          tbody.appendChild(tr);
        });
      } else {
        tbody.innerHTML = '<tr><td colspan="6" style="padding:1.5rem; text-align:center; color:var(--red);">Erro ao obter dados do servidor.</td></tr>';
      }
    })
    .catch(function(err) {
      tbody.innerHTML = '<tr><td colspan="6" style="padding:1.5rem; text-align:center; color:var(--red);">Falha de rede: ' + err.message + '</td></tr>';
    });
}

function deleteClient(id) {
  if (!confirm('Deseja realmente excluir este cliente e todo o seu histórico de rastreamento?')) return;
  
  var url = buildApiUrl('/api/clients?client_id=' + id);
  fetch(url, { method: 'DELETE' })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data && data.status === 'ok') {
        showToast('Cliente excluído com sucesso!', 'success');
        loadAdminClients();
      } else {
        showToast(data.message || 'Erro ao excluir cliente.', 'error');
      }
    })
    .catch(function(err) {
      showToast('Erro na requisição: ' + err.message, 'error');
    });
}

function viewClientTrack(deviceId, vehicleModel, plate, name) {
  // Alterar temporariamente o monitoramento ativo para o veículo selecionado
  config.deviceId = deviceId;
  clientInfo.name = name;
  clientInfo.vehicleModel = vehicleModel;
  clientInfo.plate = plate;
  
  localStorage.setItem('segcar_device', deviceId);
  localStorage.setItem('segcar_client_name', name);
  localStorage.setItem('segcar_vehicle_model', vehicleModel);
  localStorage.setItem('segcar_vehicle_plate', plate);
  
  updateClientBadgeUI();
  toggleAdminPanel();
  showToast('Monitorando agora o veículo: ' + vehicleModel + ' (' + plate + ')', 'success');
  
  // Limpar dados anteriores e recarregar
  routeCoords = [];
  if (polyline) polyline.remove();
  polyline = null;
  
  fetchNow();
}

function toggleNewAdminForm() {
  var panel = document.getElementById('new-admin-panel');
  if (!panel) return;
  
  if (panel.style.display === 'none') {
    panel.style.display = 'block';
    document.getElementById('new-admin-form').reset();
    
    // Configurar máscaras
    var cpfInput = document.getElementById('adm-cpf');
    var phoneInput = document.getElementById('adm-phone');
    
    if (cpfInput && !cpfInput.dataset.masked) {
      cpfInput.dataset.masked = 'true';
      cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.substring(0, 11);
        if (value.length > 9) value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
        else if (value.length > 6) value = value.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");
        else if (value.length > 3) value = value.replace(/^(\d{3})(\d{1,3})$/, "$1.$2");
        e.target.value = value;
      });
    }
    
    if (phoneInput && !phoneInput.dataset.masked) {
      phoneInput.dataset.masked = 'true';
      phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.substring(0, 11);
        if (value.length > 6) value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
        else if (value.length > 2) value = value.replace(/^(\d{2})(\d{1,5})$/, "($1) $2");
        else if (value.length > 0) value = '(' + value;
        e.target.value = value;
      });
    }
  } else {
    panel.style.display = 'none';
  }
}

function handleNewAdminSubmit(event) {
  event.preventDefault();
  
  var name = document.getElementById('adm-name').value.trim();
  var email = document.getElementById('adm-email').value.trim();
  var cpf = document.getElementById('adm-cpf').value.trim();
  var password = document.getElementById('adm-password').value;
  var birthDate = document.getElementById('adm-birth').value;
  var phone = document.getElementById('adm-phone').value.trim();
  
  if (cpf.replace(/[^\d]+/g, '').length !== 11) {
    showToast('CPF do Admin deve possuir 11 dígitos.', 'error');
    return;
  }

  showToast('Gravando novo administrador...', 'info');

  var url = buildApiUrl('/api/register');
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      email: email,
      cpf: cpf,
      password: password,
      birth_date: birthDate,
      phone: phone,
      role: 'admin'
    })
  })
  .then(function(res) {
    if (!res.ok) {
      return res.json().then(function(err) { throw new Error(err.message || 'Erro ao registrar administrador'); });
    }
    return res.json();
  })
  .then(function(data) {
    if (data.status === 'ok') {
      showToast('Administrador ' + name + ' cadastrado com sucesso!', 'success');
      toggleNewAdminForm();
      loadAdminClients();
    }
  })
  .catch(function(err) {
    showToast(err.message, 'error');
  });
}

/* ─── NAVEGAÇÃO ENTRE AS TELAS (SaaS Multi-Telas) ────────── */
var currentActiveView = 'view-live';

const VIEW_METADATA = {
  'view-live': {
    title: 'Mapa & Rastreamento Ao Vivo',
    shortTitle: 'Mapa Ao Vivo',
    subtitle: 'Monitoramento de telemetria em tempo real em Rio Claro-SP'
  },
  'view-telemetry': {
    title: 'Telemetria & Diagnóstico Veicular',
    shortTitle: 'Telemetria',
    subtitle: 'Sensores de aceleração, velocidade, altitude e link satelital'
  },
  'view-trips': {
    title: 'Viagens & Histórico de Rotas',
    shortTitle: 'Viagens',
    subtitle: 'Auditoria de percursos, replay de rotas e importação GPX'
  },
  'view-account': {
    title: 'Minha Conta, Veículo & Assinatura',
    shortTitle: 'Minha Conta',
    subtitle: 'Cadastro, plano contratado e histórico de pagamentos'
  },
  'view-settings': {
    title: 'Cerca Virtual & Configurações',
    shortTitle: 'Cerca & Config',
    subtitle: 'Perímetro seguro residencial, chaves de API e tempo de transmissão'
  },
  'view-admin-overview': {
    title: 'Visão Geral & Indicadores Administrativos',
    shortTitle: 'Métricas',
    subtitle: 'Métricas de negócio, receita recorrente e status dos rastreadores'
  },
  'view-admin-clients': {
    title: 'Gestão de Clientes & Contas',
    shortTitle: 'Clientes',
    subtitle: 'Cadastro, edição e controle de permissões de acesso'
  },
  'view-admin-devices': {
    title: 'Rastreadores GPS & Frota',
    shortTitle: 'Rastreadores',
    subtitle: 'Dispositivos GPS, chaves de API e status de conexão'
  },
  'view-admin-payments': {
    title: 'Financeiro & Faturamento',
    shortTitle: 'Faturamento',
    subtitle: 'Acompanhamento de mensalidades, recebimentos e faturas'
  },
  'view-admin-map': {
    title: 'Mapa Global da Frota',
    shortTitle: 'Frota Global',
    subtitle: 'Rastreamento simultâneo de todos os veículos cadastrados'
  }
};

function updateTopbarTitles() {
  var meta = VIEW_METADATA[currentActiveView];
  if (!meta) return;
  var titleEl = document.getElementById('screenTitle');
  var subEl = document.getElementById('screenSubtitle');
  var isMobile = window.innerWidth <= 600;
  if (titleEl) {
    titleEl.textContent = (isMobile && meta.shortTitle) ? meta.shortTitle : meta.title;
  }
  if (subEl) subEl.textContent = meta.subtitle;

  // Atualizar também o status text caso precise abreviar
  if (typeof currentStatusRaw !== 'undefined' && currentStatusRaw) {
    setStatus(currentStatusRaw.state, currentStatusRaw.text);
  }
}

window.addEventListener('resize', updateTopbarTitles);

function switchView(viewId) {
  if (!VIEW_METADATA[viewId]) return;
  currentActiveView = viewId;

  // Atualizar abas na sidebar
  document.querySelectorAll('.nav-item').forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-view') === viewId);
  });

  // Atualizar abas no bottom nav mobile
  document.querySelectorAll('.bottom-nav-item').forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-view') === viewId);
  });

  // Alternar painéis das telas
  document.querySelectorAll('.view-pane').forEach(function(pane) {
    pane.classList.toggle('active', pane.id === viewId);
  });

  // Atualizar cabeçalho da Topbar
  updateTopbarTitles();

  // Se for o mapa ao vivo, forçar redimensionamento dos tiles Leaflet
  if (viewId === 'view-live') {
    setTimeout(function() {
      if (typeof map !== 'undefined' && map) {
        map.invalidateSize();
      }
    }, 150);
  }

  // Se for a tela de conta, carregar assinaturas e faturas da API
  if (viewId === 'view-account') {
    loadAccountDetails();
  }

  // Ganchos para carregar as telas administrativas dinamicamente
  if (viewId === 'view-admin-overview' && typeof loadOverviewMetrics === 'function') {
    loadOverviewMetrics(false);
  }
  if (viewId === 'view-admin-clients' && typeof loadClients === 'function') {
    loadClients();
  }
  if (viewId === 'view-admin-devices' && typeof loadDevices === 'function') {
    loadDevices();
  }
  if (viewId === 'view-admin-payments' && typeof loadPayments === 'function') {
    loadPayments();
  }
  if (viewId === 'view-admin-map' && typeof initGlobalMap === 'function') {
    setTimeout(initGlobalMap, 150);
  }

  // Fechar sidebar mobile se estiver aberta
  closeMobileSidebar();

  localStorage.setItem('segcar_active_view', viewId);
}

function toggleMobileSidebar() {
  var sidebar = document.getElementById('appSidebar');
  var backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar && backdrop) {
    sidebar.classList.toggle('open');
    backdrop.classList.toggle('active');
  }
}

function closeMobileSidebar() {
  var sidebar = document.getElementById('appSidebar');
  var backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) sidebar.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
}

function copyCurrentCoords() {
  var lat = document.getElementById('val-lat').textContent;
  var lng = document.getElementById('val-lng').textContent;
  if (lat && lng && lat !== '–') {
    var text = lat + ', ' + lng;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function() {
        showToast('Coordenadas copiadas: ' + text, 'success');
      }).catch(function() {
        showToast('Coordenadas: ' + text, 'info');
      });
    } else {
      showToast('Coordenadas: ' + text, 'info');
    }
  }
}

function setBillingFormFields(addr) {
  if (!addr) return;
  var cep = document.getElementById('bill-cep');
  var street = document.getElementById('bill-street');
  var number = document.getElementById('bill-number');
  var comp = document.getElementById('bill-complement');
  var neigh = document.getElementById('bill-neighborhood');
  var city = document.getElementById('bill-city');
  var state = document.getElementById('bill-state');

  if (cep && addr.zip_code) cep.value = addr.zip_code;
  if (street && addr.street) street.value = addr.street;
  if (number && addr.number) number.value = addr.number;
  if (comp) comp.value = addr.complement || '';
  if (neigh && addr.neighborhood) neigh.value = addr.neighborhood;
  if (city && addr.city) city.value = addr.city;
  if (state && addr.state) state.value = addr.state;
}

function toggleBillingAddressEdit() {
  var displayBox = document.getElementById('acc-address-box');
  var form = document.getElementById('form-billing-address');
  var btnText = document.getElementById('btn-billing-text');
  if (!displayBox || !form) return;

  var isEditing = form.style.display !== 'none';
  if (isEditing) {
    form.style.display = 'none';
    displayBox.style.display = 'block';
    if (btnText) btnText.textContent = 'Alterar Endereço';
  } else {
    form.style.display = 'block';
    displayBox.style.display = 'none';
    if (btnText) btnText.textContent = 'Fechar';
    var cepInput = document.getElementById('bill-cep');
    if (cepInput) cepInput.focus();
  }
}

function buscarCepBilling(val) {
  if (!val) return;
  var cep = val.replace(/\D/g, '');
  if (cep.length !== 8) return;

  fetch('https://viacep.com.br/ws/' + cep + '/json/')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (!data.erro) {
        var street = document.getElementById('bill-street');
        var neigh = document.getElementById('bill-neighborhood');
        var city = document.getElementById('bill-city');
        var state = document.getElementById('bill-state');
        var num = document.getElementById('bill-number');

        if (street && data.logradouro) street.value = data.logradouro;
        if (neigh && data.bairro) neigh.value = data.bairro;
        if (city && data.localidade) city.value = data.localidade;
        if (state && data.uf) state.value = data.uf;
        if (num) num.focus();
        showToast('Endereço preenchido via CEP com sucesso!', 'success');
      } else {
        showToast('CEP não encontrado na base dos Correios.', 'info');
      }
    })
    .catch(function(err) {
      console.warn('Erro ao consultar ViaCEP:', err);
    });
}

function handleSaveBillingAddress(e) {
  e.preventDefault();
  var clientId = (clientInfo && clientInfo.id) ? clientInfo.id : 1;
  var btn = document.getElementById('btn-save-billing');

  var payload = {
    client_id: clientId,
    zip_code: document.getElementById('bill-cep').value.trim(),
    street: document.getElementById('bill-street').value.trim(),
    number: document.getElementById('bill-number').value.trim(),
    complement: document.getElementById('bill-complement').value.trim(),
    neighborhood: document.getElementById('bill-neighborhood').value.trim(),
    city: document.getElementById('bill-city').value.trim(),
    state: document.getElementById('bill-state').value.trim().toUpperCase()
  };

  if (!payload.zip_code || !payload.street || !payload.number || !payload.neighborhood || !payload.city || !payload.state) {
    showToast('Por favor, preencha todos os campos obrigatórios do endereço.', 'info');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Salvando...';
  }

  var url = buildApiUrl('/api/addresses');
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Salvar Novo Endereço';
    }

    if (data && (data.status === 'ok' || data.success)) {
      showToast('Endereço de cobrança atualizado com sucesso!', 'success');

      // Atualizar visualização do endereço no card
      var streetEl = document.getElementById('acc-street');
      var detailsEl = document.getElementById('acc-neighborhood-city');
      if (streetEl) streetEl.textContent = payload.street + ', ' + payload.number + (payload.complement ? ' - ' + payload.complement : '');
      if (detailsEl) detailsEl.textContent = payload.neighborhood + ' • ' + payload.city + ' - ' + payload.state + ' • CEP: ' + payload.zip_code;

      // Fechar formulário e voltar para visualização
      toggleBillingAddressEdit();
    } else {
      showToast('Erro ao salvar endereço: ' + (data.message || 'Tente novamente.'), 'info');
    }
  })
  .catch(function(err) {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Salvar Novo Endereço';
    }
    console.error('Erro ao salvar endereço:', err);
    showToast('Falha na comunicação com o servidor.', 'info');
  });
}

function loadAccountDetails() {
  var clientId = (clientInfo && clientInfo.id) ? clientInfo.id : 1;

  // Buscar dados de endereço cadastrado
  var addrUrl = buildApiUrl('/api/addresses?client_id=' + clientId);
  fetch(addrUrl)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data && data.status === 'ok' && data.address) {
        var addr = data.address;
        var streetEl = document.getElementById('acc-street');
        var detailsEl = document.getElementById('acc-neighborhood-city');
        if (streetEl) streetEl.textContent = addr.street + ', ' + (addr.number || 'S/N') + (addr.complement ? ' - ' + addr.complement : '');
        if (detailsEl) detailsEl.textContent = (addr.neighborhood || 'Centro') + ' • ' + (addr.city || 'Rio Claro') + ' - ' + (addr.state || 'SP') + ' • CEP: ' + (addr.zip_code || '13500-000');

        // Preencher formulário de edição
        setBillingFormFields(addr);
      }
    })
    .catch(function(err) {
      console.warn('Erro ao carregar endereço:', err);
    });

  // Buscar plano e assinatura
  var subUrl = buildApiUrl('/api/subscriptions?client_id=' + clientId);
  fetch(subUrl)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data && data.status === 'ok' && data.subscription) {
        var sub = data.subscription;
        var planName = sub.plan_name || 'Plano Básico';
        var planBadge = document.getElementById('acc-plan-badge');
        var planPrice = document.getElementById('acc-plan-price');
        if (planBadge) planBadge.textContent = planName.toUpperCase();
        if (planPrice) planPrice.textContent = 'R$ ' + (sub.price || 49.9).toFixed(2).replace('.', ',');
      }
    })
    .catch(function(err) {
      console.warn('Erro ao carregar assinatura:', err);
    });

  // Carregar histórico de faturas / pagamentos
  var payUrl = buildApiUrl('/api/payments?client_id=' + clientId);
  var container = document.getElementById('acc-payments-table-container');

  fetch(payUrl)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data && data.status === 'ok' && data.payments && data.payments.length > 0) {
        var html = '<table style="width:100%; border-collapse:collapse; font-size:0.85rem;">' +
          '<thead><tr style="border-bottom:1px solid rgba(255,255,255,0.1); color:var(--text-3); text-align:left;">' +
          '<th style="padding:0.6rem 0;">Vencimento</th>' +
          '<th>Valor</th>' +
          '<th>Método</th>' +
          '<th style="text-align:right;">Status</th>' +
          '</tr></thead><tbody>';

        data.payments.forEach(function(p) {
          var isPaid = p.status === 'paid';
          var statusBadge = isPaid
            ? '<span style="color:var(--green); font-weight:700; background:rgba(16,185,129,0.15); padding:0.2rem 0.5rem; border-radius:4px;">Pago</span>'
            : '<span style="color:var(--amber); font-weight:700; background:rgba(245,158,11,0.15); padding:0.2rem 0.5rem; border-radius:4px;">Pendente</span>';
          
          var dueDate = p.due_date ? new Date(p.due_date).toLocaleDateString('pt-BR') : '–';
          var method = (p.payment_method || 'Pix').toUpperCase();

          html += '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">' +
            '<td style="padding:0.65rem 0; font-family:\'JetBrains Mono\', monospace; color:#cbd5e1;">' + dueDate + '</td>' +
            '<td style="font-weight:700; color:#fff;">R$ ' + p.amount.toFixed(2).replace('.', ',') + '</td>' +
            '<td style="color:var(--cyan); font-weight:600;">' + method + '</td>' +
            '<td style="text-align:right;">' + statusBadge + '</td>' +
            '</tr>';
        });

        html += '</tbody></table>';
        if (container) container.innerHTML = html;
      } else {
        if (container) container.innerHTML = '<div class="no-data" style="padding:1.5rem 0;"><div class="no-data-text">Nenhuma fatura pendente encontrada. Todas as mensalidades estão em dia.</div></div>';
      }
    })
    .catch(function() {
      if (container) container.innerHTML = '<div class="no-data" style="padding:1rem;">Erro ao carregar faturas do servidor.</div>';
    });
}

// Inicializar tela salva ao carregar
window.addEventListener('DOMContentLoaded', function() {
  var saved = localStorage.getItem('segcar_active_view') || 'view-live';
  switchView(saved);
});