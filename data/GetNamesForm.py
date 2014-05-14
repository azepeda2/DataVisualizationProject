import xlwt
import xlrd


workbook = xlrd.open_workbook('map.xlsx')
sheet = workbook.sheet_by_index(0)


newworkbook = xlwt.Workbook()
newsheet = newworkbook.add_sheet('sheet1')
column = 0

for index in range(sheet.nrows):
    name = sheet.cell(index, 0).value
    formline = '<option value="' + sheet.cell(index, column).value + '">'
    newsheet.write(index, 0, formline)
    print 'wrote line ', name

newworkbook.save('names.xlsx')
