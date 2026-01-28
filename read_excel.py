# -*- coding: utf-8 -*-
import zipfile
import xml.etree.ElementTree as ET
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

z = zipfile.ZipFile('价格表.xlsx')

tree = ET.parse(z.open('xl/sharedStrings.xml'))
root = tree.getroot()
strings = [elem.text for elem in root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si/{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')]

tree = ET.parse(z.open('xl/worksheets/sheet1.xml'))
root = tree.getroot()
ns = {'r': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
cells = root.findall('.//r:c', ns)

data = {}
for cell in cells:
    cell_ref = cell.get('r')
    if cell_ref:
        row_num = int(''.join(filter(str.isdigit, cell_ref)))
        col_letters = ''.join(filter(str.isalpha, cell_ref))
        col_num = 0
        for i, c in enumerate(reversed(col_letters)):
            col_num += (ord(c) - ord('A') + 1) * (26 ** i)
        
        v_elem = cell.find('r:v', ns)
        if v_elem is not None and v_elem.text:
            value = v_elem.text
            try:
                idx = int(v_elem.text)
                if idx < len(strings):
                    value = strings[idx]
            except ValueError:
                pass
            if row_num not in data:
                data[row_num] = {}
            data[row_num][col_num] = value

products = []

for row_num in sorted(data.keys()):
    if row_num < 5:
        continue
    
    row = data[row_num]
    
    if 2 in row:
        name = row[2]
        if name and '产品' not in name and '系列' not in name and '图片' not in name and '规格' not in name and '序号' not in name and '合计' not in name and '说明' not in name and '采购' not in name and '大写' not in name and '时间' not in name and '制单' not in name and '联系' not in name and '供货' not in name and '条码' not in name and '装箱' not in name and '出厂' not in name and '数量' not in name and '采购金额' not in name and '建议' not in name and name.strip() != ' ':
            product = {
                'name': name,
                'factory_price': None,
                'retail_price': None
            }
            
            if 4 in row:
                val = row[4]
                try:
                    float(val)
                    product['factory_price'] = val
                except ValueError:
                    pass
            
            if 5 in row:
                val = row[5]
                try:
                    float(val)
                    product['retail_price'] = val
                except ValueError:
                    pass
            
            products.append(product)

print("找到的产品数量:", len(products))
for i, product in enumerate(products):
    print("{}. {} - 出厂价: {}, 零售价: {}".format(i+1, product['name'], product['factory_price'], product['retail_price']))