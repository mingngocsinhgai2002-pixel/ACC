import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const missingImages = JSON.parse(fs.readFileSync('missing-images.json', 'utf8'));

const pexelsMapping = {
  'an.jpg': 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?w=400',
  'ao.jpg': 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?w=400',
  'bac.jpg': 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=400',
  'bac_si.jpg': 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?w=400',
  'ban_chai.jpg': 'https://images.pexels.com/photos/3958379/pexels-photo-3958379.jpeg?w=400',
  'benh_vien.jpg': 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?w=400',
  'bep.jpg': 'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?w=400',
  'bien.jpg': 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?w=400',
  'binh_thuong.jpg': 'https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?w=400',
  'boi.jpg': 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?w=400',
  'bong.jpg': 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?w=400',
  'buc_minh.jpg': 'https://images.pexels.com/photos/897817/pexels-photo-897817.jpeg?w=400',
  'but.jpg': 'https://images.pexels.com/photos/159675/pen-writing-ballpoint-pen-fountain-pen-159675.jpeg?w=400',
  'cap.jpg': 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?w=400',
  'cau.jpg': 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?w=400',
  'chai_toc.jpg': 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?w=400',
  'chan.jpg': 'https://images.pexels.com/photos/545012/pexels-photo-545012.jpeg?w=400',
  'chay.jpg': 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?w=400',
  'chu.jpg': 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=400',
  'chup_anh.jpg': 'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?w=400',
  'co.jpg': 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=400',
  'co_giao.jpg': 'https://images.pexels.com/photos/8926546/pexels-photo-8926546.jpeg?w=400',
  'coc.jpg': 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?w=400',
  'con.jpg': 'https://images.pexels.com/photos/1974508/pexels-photo-1974508.jpeg?w=400',
  'cong_vien.jpg': 'https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?w=400',
  'da_bong.jpg': 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?w=400',
  'danh_rang.jpg': 'https://images.pexels.com/photos/3779705/pexels-photo-3779705.jpeg?w=400',
  'dau.jpg': 'https://images.pexels.com/photos/5327584/pexels-photo-5327584.jpeg?w=400',
  'di.jpg': 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=400',
  'di_dao.jpg': 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?w=400',
  've_sinh.jpg': 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?w=400',
  'di_xe_dap.jpg': 'https://images.pexels.com/photos/1595130/pexels-photo-1595130.jpeg?w=400',
  'dien_thoai.jpg': 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?w=400',
  'do_choi.jpg': 'https://images.pexels.com/photos/1619801/pexels-photo-1619801.jpeg?w=400',
  'doi.jpg': 'https://images.pexels.com/photos/3771823/pexels-photo-3771823.jpeg?w=400',
  'don_dep.jpg': 'https://images.pexels.com/photos/4099354/pexels-photo-4099354.jpeg?w=400',
  'ghet.jpg': 'https://images.pexels.com/photos/3808904/pexels-photo-3808904.jpeg?w=400',
  'giay.jpg': 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?w=400',
  'giup_do.jpg': 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?w=400',
  'goi.jpg': 'https://images.pexels.com/photos/1471843/pexels-photo-1471843.jpeg?w=400',
  'hanh_phuc.jpg': 'https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?w=400',
  'hat.jpg': 'https://images.pexels.com/photos/3661263/pexels-photo-3661263.jpeg?w=400',
  'hoc.jpg': 'https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?w=400',
  'kem_danh_rang.jpg': 'https://images.pexels.com/photos/3975590/pexels-photo-3975590.jpeg?w=400',
  'khan.jpg': 'https://images.pexels.com/photos/8844846/pexels-photo-8844846.jpeg?w=400',
  'khat.jpg': 'https://images.pexels.com/photos/5938388/pexels-photo-5938388.jpeg?w=400',
  'lam_vuon.jpg': 'https://images.pexels.com/photos/4750268/pexels-photo-4750268.jpeg?w=400',
  'lanh.jpg': 'https://images.pexels.com/photos/3628908/pexels-photo-3628908.jpeg?w=400',
  'lo_lang.jpg': 'https://images.pexels.com/photos/3768126/pexels-photo-3768126.jpeg?w=400',
  'mac_quan_ao.jpg': 'https://images.pexels.com/photos/5560027/pexels-photo-5560027.jpeg?w=400',
  'may_tinh.jpg': 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?w=400',
  'met.jpg': 'https://images.pexels.com/photos/4473622/pexels-photo-4473622.jpeg?w=400',
  'nau_an.jpg': 'https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?w=400',
  'nghe_nhac.jpg': 'https://images.pexels.com/photos/3693283/pexels-photo-3693283.jpeg?w=400',
  'nghi_ngoi.jpg': 'https://images.pexels.com/photos/4474052/pexels-photo-4474052.jpeg?w=400',
  'nha.jpg': 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?w=400',
  'nha_ban.jpg': 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=400',
  'nha_hang.jpg': 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=400',
  'nha_tam.jpg': 'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?w=400',
  'nhay.jpg': 'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?w=400',
  'nhay_day.jpg': 'https://images.pexels.com/photos/8612990/pexels-photo-8612990.jpeg?w=400',
  'nho.jpg': 'https://images.pexels.com/photos/3808904/pexels-photo-3808904.jpeg?w=400',
  'noi_chuyen.jpg': 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?w=400',
  'non.jpg': 'https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?w=400',
  'nong.jpg': 'https://images.pexels.com/photos/2471215/pexels-photo-2471215.jpeg?w=400',
  'nui.jpg': 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?w=400',
  'phong_ngu.jpg': 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?w=400',
  'quan.jpg': 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?w=400',
  'rap_phim.jpg': 'https://images.pexels.com/photos/3709369/pexels-photo-3709369.jpeg?w=400',
  'rua_tay.jpg': 'https://images.pexels.com/photos/4009721/pexels-photo-4009721.jpeg?w=400',
  'sach.jpg': 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?w=400',
  'san_choi.jpg': 'https://images.pexels.com/photos/1146603/pexels-photo-1146603.jpeg?w=400',
  'sieu_thi.jpg': 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?w=400',
  'thay_giao.jpg': 'https://images.pexels.com/photos/8926555/pexels-photo-8926555.jpeg?w=400',
  'thich.jpg': 'https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?w=400',
  'thu_vien.jpg': 'https://images.pexels.com/photos/2898170/pexels-photo-2898170.jpeg?w=400',
  'truong.jpg': 'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?w=400',
  'tv.jpg': 'https://images.pexels.com/photos/333984/pexels-photo-333984.jpeg?w=400',
  've.jpg': 'https://images.pexels.com/photos/1789968/pexels-photo-1789968.jpeg?w=400',
  'vo.jpg': 'https://images.pexels.com/photos/261679/pexels-photo-261679.jpeg?w=400',
  'xe_dap.jpg': 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?w=400',
  'xem_tv.jpg': 'https://images.pexels.com/photos/1444417/pexels-photo-1444417.jpeg?w=400',
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download: ${url}`));
      }
    }).on('error', reject);
  });
}

async function downloadAll() {
  const imagesDir = path.join(__dirname, 'images');

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
  }

  let count = 0;
  for (const [filename, url] of Object.entries(pexelsMapping)) {
    const filepath = path.join(imagesDir, filename);

    try {
      await downloadImage(url, filepath);
      count++;
      console.log(`✓ ${count}/${Object.keys(pexelsMapping).length} ${filename}`);
    } catch (error) {
      console.error(`✗ ${filename}: ${error.message}`);
    }
  }

  console.log(`\n🎉 Đã tải xong ${count}/${Object.keys(pexelsMapping).length} ảnh!`);
}

downloadAll();
