import xlwt
import xlrd


workbook = xlrd.open_workbook('top100.xlsx')
sheet = workbook.sheet_by_index(0)


newworkbook = xlwt.Workbook()
newsheet = newworkbook.add_sheet('sheet1')
current = 0

for index in range(sheet.nrows):
    row = sheet.row(index)
    schoolid = sheet.cell(index, 2).value
    #print row
    if index + 1 < sheet.nrows and schoolid != sheet.cell(index + 1, 2).value:
        for column in range(sheet.ncols):
            newsheet.write(current, column, sheet.cell(index, column).value)

        current = current + 1
        print 'wrote line ', schoolid

    
    

newworkbook.save('output.xlsx')
